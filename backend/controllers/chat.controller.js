import db from '../db/index.js';
import { processChat } from '../services/chat.service.js';

export async function sendChat(req, res) {
  const { messages, tacticContext, sessionId } = req.body;
  if (!Array.isArray(messages) || !messages.length) {
    return res.status(400).json({ error: 'messages wajib berupa array dan tidak kosong' });
  }

  try {
    const { reply, toolCalls } = await processChat(messages, tacticContext);

    if (sessionId) {
      const lastUserMsg = messages[messages.length - 1];
      const logStmt = db.prepare('INSERT INTO chat_logs (session_id, role, content) VALUES (?,?,?)');
      logStmt.run(sessionId, 'user', lastUserMsg?.content || '');
      logStmt.run(sessionId, 'assistant', reply);
    }

    res.json({ reply, toolCalls });
  } catch (err) {
    console.error('Chat proxy error:', err);
    if (err.message.includes('AI belum dikonfigurasi')) {
      return res.status(503).json({ error: err.message });
    }
    if (err.message.includes('Groq API error')) {
      return res.status(502).json({ error: err.message });
    }
    res.status(500).json({ error: 'Gagal menghubungi layanan AI. Coba lagi sebentar.' });
  }
}
