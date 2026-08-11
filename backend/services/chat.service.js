import { AI_TOOLS, executeTool } from '../utils/aiTools.js';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MAX_TOOL_ROUNDS = 5;

// Convert Anthropic tool format to OpenAI/Groq tool format
const GROQ_TOOLS = AI_TOOLS.map(t => ({
  type: 'function',
  function: {
    name: t.name,
    description: t.description,
    parameters: t.input_schema
  }
}));

async function callGroq(conversationMessages) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      max_tokens: 700,
      messages: conversationMessages,
      tools: GROQ_TOOLS,
      tool_choice: 'auto'
    }),
  });
  return res.json();
}

export async function processChat(messages, tacticContext) {
  if (!GROQ_API_KEY) {
    throw new Error('AI belum dikonfigurasi di server. Set GROQ_API_KEY di environment.');
  }

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

  // Siapkan message dengan format Groq (OpenAI format)
  let conversationMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({
      role: m.role,
      content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content)
    }))
  ];

  let finalText = null;
  let toolCallLog = []; // untuk debug/transparansi ke frontend

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const data = await callGroq(conversationMessages);

    if (data.error) {
      throw new Error(data.error.message || 'Groq API error');
    }

    const responseMessage = data.choices[0].message;

    // Jika LLM menggunakan tool
    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      // 1. Masukkan response message yang berisi tool_calls ke riwayat
      conversationMessages.push(responseMessage);

      // 2. Eksekusi setiap tool dan kirim balik hasilnya
      for (const toolCall of responseMessage.tool_calls) {
        if (toolCall.type === 'function') {
          const funcName = toolCall.function.name;
          const args = JSON.parse(toolCall.function.arguments);
          
          const result = executeTool(funcName, args);
          toolCallLog.push({ tool: funcName, input: args });
          
          conversationMessages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            name: funcName,
            content: JSON.stringify(result)
          });
        }
      }
      continue; // lanjut ke ronde berikutnya
    }

    // Jika LLM sudah memberikan teks jawaban akhir
    finalText = responseMessage.content;
    break;
  }

  if (finalText === null) {
    finalText = 'Maaf, butuh terlalu banyak langkah pencarian data untuk pertanyaan ini. Coba pertanyaan yang lebih spesifik.';
  }

  return { reply: finalText, toolCalls: toolCallLog };
}
