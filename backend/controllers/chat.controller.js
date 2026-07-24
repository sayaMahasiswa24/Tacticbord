// ════════════════════════════════════════════════════════
//  controllers/chat.controller.js — Proxy ke Anthropic API.
//  API key HANYA hidup di server, tidak pernah dikirim ke browser.
// ════════════════════════════════════════════════════════
import db from '../db/index.js';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export async function sendChat(req, res) {
  if (!ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'AI belum dikonfigurasi di server. Set ANTHROPIC_API_KEY di environment.' });
  }
  const { messages, tacticContext, sessionId } = req.body;
  if (!Array.isArray(messages) || !messages.length) {
    return res.status(400).json({ error: 'messages wajib berupa array dan tidak kosong' });
  }

  const systemPrompt = `Kamu adalah asisten taktik sepak bola untuk pelatih yang sedang menyusun formasi di aplikasi TacticBord.
Jawab dalam Bahasa Indonesia, ringkas (maks 150 kata), langsung ke saran/solusi praktis — hindari basa-basi panjang.
Gunakan **teks tebal** untuk istilah taktis penting.

Konteks papan taktik saat ini:
${tacticContext || '(tidak ada konteks taktik dikirim)'}`;

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 500,
        system: systemPrompt,
        messages,
      }),
    });
    const data = await upstream.json();

    if (data.error) return res.status(502).json({ error: data.error.message || 'Anthropic API error' });

    const replyText = data.content?.[0]?.text || 'Tidak ada respons.';

    if (sessionId) {
      const lastUserMsg = messages[messages.length - 1];
      const logStmt = db.prepare('INSERT INTO chat_logs (session_id, role, content) VALUES (?,?,?)');
      logStmt.run(sessionId, 'user', lastUserMsg?.content || '');
      logStmt.run(sessionId, 'assistant', replyText);
    }

    res.json({ reply: replyText });
  } catch (err) {
    console.error('Chat proxy error:', err);
    res.status(500).json({ error: 'Gagal menghubungi layanan AI. Coba lagi sebentar.' });
  }
}
