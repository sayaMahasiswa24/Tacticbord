// ════════════════════════════════════════════════════════
//  controllers/chat.controller.js — Proxy ke Anthropic API
//  DENGAN TOOL-USE. API key hanya hidup di server.
//
//  Alur: Claude terima system prompt (konteks papan taktik
//  saat ini) + daftar tools. Kalau Claude butuh data lebih
//  luas (role lain, style preset lain, dsb) dia panggil tool
//  -> backend eksekusi query SQL -> hasil dikirim balik ke
//  Claude -> diulang sampai Claude kasih jawaban akhir.
// ════════════════════════════════════════════════════════
import db from '../db/index.js';
import { AI_TOOLS, executeTool } from '../utils/aiTools.js';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MAX_TOOL_ROUNDS = 5; // guard rail — cegah loop tak berkesudahan

async function callAnthropic(systemPrompt, conversationMessages) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 700,
      system: systemPrompt,
      tools: AI_TOOLS,
      messages: conversationMessages,
    }),
  });
  return res.json();
}

export async function sendChat(req, res) {
  if (!ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'AI belum dikonfigurasi di server. Set ANTHROPIC_API_KEY di environment.' });
  }
  const { messages, tacticContext, sessionId } = req.body;
  if (!Array.isArray(messages) || !messages.length) {
    return res.status(400).json({ error: 'messages wajib berupa array dan tidak kosong' });
  }

  // System prompt sengaja LEBIH RINGKAS dari versi sebelumnya — hanya berisi
  // konteks papan taktik yang sedang aktif. Untuk pertanyaan yang butuh data
  // di luar itu (role lain, style preset lain, dsb), Claude memanggil tools.
  const systemPrompt = `Kamu adalah asisten taktik sepak bola yang tegas untuk pelatih yang sedang menyusun formasi di aplikasi TacticBoard.
Jawab dalam Bahasa Indonesia, ringkas (maks 150 kata), dan langsung berikan saran atau solusi praktis.
Gunakan **teks tebal** untuk istilah taktis yang penting.

PENTING - BATASAN DOMAIN:
1. Pengetahuanmu HANYA seputar sepak bola, taktik, formasi, susunan pemain, dan aplikasi TacticBoard ini.
2. Jika pengguna bertanya tentang topik di luar sepak bola (seperti matematika, memasak, politik, coding, kesehatan umum, dll), kamu WAJIB MENOLAKNYA dengan tegas namun profesional ala pelatih. 
   Contoh penolakan: "Fokus ke lapangan! Saya di sini sebagai asisten taktik sepak bola, bukan untuk membahas hal itu. Mari kembali bahas formasi tim kita."
3. Jangan pernah memberikan jawaban atas topik di luar sepak bola meskipun pengguna mendesak.

Kamu punya akses ke tools untuk mencari role, formasi, dan preset gaya bermain lain di database
selain yang sedang aktif di papan — pakai tools itu kalau pertanyaan user butuh data di luar konteks berikut.
Jangan mengeksekusi tools untuk mencari hal-hal yang tidak relevan dengan sepak bola.
Jangan menebak atribut role dari memori — selalu pakai get_role_detail/search_roles untuk data yang akurat.

Konteks papan taktik saat ini:
${tacticContext || '(tidak ada konteks taktik dikirim)'}`;

  let conversationMessages = [...messages];
  let finalText = null;
  let toolCallLog = []; // untuk debug/transparansi ke frontend (opsional)

  try {
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const data = await callAnthropic(systemPrompt, conversationMessages);

      if (data.error) return res.status(502).json({ error: data.error.message || 'Anthropic API error' });

      if (data.stop_reason === 'tool_use') {
        // Simpan pesan assistant (berisi tool_use blocks) ke riwayat percakapan
        conversationMessages.push({ role: 'assistant', content: data.content });

        // Eksekusi setiap tool_use, kumpulkan tool_result
        const toolResults = [];
        for (const block of data.content) {
          if (block.type === 'tool_use') {
            const result = executeTool(block.name, block.input);
            toolCallLog.push({ tool: block.name, input: block.input });
            toolResults.push({
              type: 'tool_result',
              tool_use_id: block.id,
              content: JSON.stringify(result),
            });
          }
        }
        conversationMessages.push({ role: 'user', content: toolResults });
        continue; // lanjut ke ronde berikutnya, Claude proses hasil tool
      }

      // stop_reason !== 'tool_use' → jawaban akhir sudah siap
      finalText = data.content?.find(b => b.type === 'text')?.text || 'Tidak ada respons.';
      break;
    }

    if (finalText === null) {
      finalText = 'Maaf, butuh terlalu banyak langkah pencarian data untuk pertanyaan ini. Coba pertanyaan yang lebih spesifik.';
    }

    if (sessionId) {
      const lastUserMsg = messages[messages.length - 1];
      const logStmt = db.prepare('INSERT INTO chat_logs (session_id, role, content) VALUES (?,?,?)');
      logStmt.run(sessionId, 'user', lastUserMsg?.content || '');
      logStmt.run(sessionId, 'assistant', finalText);
    }

    res.json({ reply: finalText, toolCalls: toolCallLog });
  } catch (err) {
    console.error('Chat proxy error:', err);
    res.status(500).json({ error: 'Gagal menghubungi layanan AI. Coba lagi sebentar.' });
  }
}
