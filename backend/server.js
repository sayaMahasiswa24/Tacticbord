// ════════════════════════════════════════════════════════
//  server.js — TacticBord Backend API
//  Menyediakan: data role/zone dari database, penyimpanan
//  taktik, dan proxy AI agent (API key aman di server).
// ════════════════════════════════════════════════════════
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import db from './db/index.js';

const app = express();
const PORT = process.env.PORT || 8787;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

app.use(cors({ origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN.split(',') }));
app.use(express.json({ limit: '1mb' }));

// ── Helper: ubah row SQLite (0/1) jadi boolean utk field tertentu ──
function toRoleDTO(row) {
  return {
    id: row.role_id,
    name: row.role_name,
    short: row.short_name,
    posType: row.pos_type,
    posGroup: row.pos_group,
    side: row.valid_side,
    formations: row.valid_formations,
    width: row.width_tendency,
    depth: row.depth_tendency,
    attackingRun: !!row.attacking_run,
    dropsDeep: !!row.drops_deep,
    overlap: row.overlap_tendency,
    pressing: row.pressing_intensity,
    fillsSpace: !!row.fills_runner_space,
    attackSP: !!row.attack_set_piece,
    defendSP: row.defend_set_piece,
    desc: row.description,
  };
}
function toZoneDTO(row) {
  return {
    key: row.zone_key, name: row.zone_name, side: row.side,
    x: row.base_rel_x, y: row.base_rel_y,
    xv: row.x_variance, yv: row.y_variance, depthLine: row.depth_line,
  };
}

// ════════════════════════════════════════════════════════
//  HEALTH CHECK
// ════════════════════════════════════════════════════════
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    roles: db.prepare('SELECT COUNT(*) c FROM role_master').get().c,
    zones: db.prepare('SELECT COUNT(*) c FROM zone_coordinate_map').get().c,
    savedTactics: db.prepare('SELECT COUNT(*) c FROM saved_tactics').get().c,
    aiConfigured: !!ANTHROPIC_API_KEY,
  });
});

// ════════════════════════════════════════════════════════
//  ROLES
// ════════════════════════════════════════════════════════
app.get('/api/roles', (req, res) => {
  const { posType, search } = req.query;
  let sql = 'SELECT * FROM role_master WHERE 1=1';
  const params = [];
  if (posType) { sql += ' AND pos_type = ?'; params.push(posType); }
  if (search) {
    sql += ' AND (role_name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  sql += ' ORDER BY pos_group, role_name';
  const rows = db.prepare(sql).all(...params);
  res.json(rows.map(toRoleDTO));
});

app.get('/api/roles/:roleId', (req, res) => {
  const row = db.prepare('SELECT * FROM role_master WHERE role_id = ?').get(req.params.roleId);
  if (!row) return res.status(404).json({ error: 'Role tidak ditemukan' });
  res.json(toRoleDTO(row));
});

// Detail gerakan sebuah role (jika tabel role_phase_movement sudah diisi)
app.get('/api/roles/:roleId/movement', (req, res) => {
  const rows = db.prepare('SELECT * FROM role_phase_movement WHERE role_id = ?').all(req.params.roleId);
  res.json(rows);
});

// Conditional rules sebuah role
app.get('/api/roles/:roleId/rules', (req, res) => {
  const rows = db.prepare('SELECT * FROM role_conditional_rules WHERE role_id = ? ORDER BY priority').all(req.params.roleId);
  res.json(rows);
});

// ════════════════════════════════════════════════════════
//  ZONES
// ════════════════════════════════════════════════════════
app.get('/api/zones', (req, res) => {
  const { name, side } = req.query;
  let sql = 'SELECT * FROM zone_coordinate_map WHERE 1=1';
  const params = [];
  if (name) { sql += ' AND zone_name = ?'; params.push(name); }
  if (side) { sql += ' AND side = ?'; params.push(side); }
  const rows = db.prepare(sql).all(...params);
  res.json(rows.map(toZoneDTO));
});

// ════════════════════════════════════════════════════════
//  SAVED TACTICS  (menggantikan localStorage browser)
// ════════════════════════════════════════════════════════
app.get('/api/tactics', (req, res) => {
  const rows = db.prepare('SELECT id, name, note, formation_id, formation_name, created_at FROM saved_tactics ORDER BY created_at DESC').all();
  res.json(rows);
});

app.get('/api/tactics/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM saved_tactics WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Taktik tidak ditemukan' });
  res.json({
    ...row,
    roles: JSON.parse(row.roles_json),
    positions: JSON.parse(row.positions_json),
    drawings: row.drawings_json ? JSON.parse(row.drawings_json) : [],
  });
});

app.post('/api/tactics', (req, res) => {
  const { name, note, formationId, formationName, roles, positions, drawings } = req.body;
  if (!name || !formationId) return res.status(400).json({ error: 'name dan formationId wajib diisi' });
  const stmt = db.prepare(`
    INSERT INTO saved_tactics (name, note, formation_id, formation_name, roles_json, positions_json, drawings_json)
    VALUES (?,?,?,?,?,?,?)
  `);
  const info = stmt.run(
    name, note || null, formationId, formationName || formationId,
    JSON.stringify(roles || {}), JSON.stringify(positions || []), JSON.stringify(drawings || [])
  );
  res.status(201).json({ id: Number(info.lastInsertRowid), message: 'Taktik tersimpan' });
});

app.delete('/api/tactics/:id', (req, res) => {
  const info = db.prepare('DELETE FROM saved_tactics WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Taktik tidak ditemukan' });
  res.json({ message: 'Taktik dihapus' });
});

// ════════════════════════════════════════════════════════
//  AI CHAT PROXY — API key aman di server, tidak pernah
//  dikirim ke browser. Frontend cukup panggil endpoint ini.
// ════════════════════════════════════════════════════════
app.post('/api/chat', async (req, res) => {
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

    if (data.error) {
      return res.status(502).json({ error: data.error.message || 'Anthropic API error' });
    }

    const replyText = data.content?.[0]?.text || 'Tidak ada respons.';

    // Simpan log percakapan (opsional, untuk audit)
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
});

// ════════════════════════════════════════════════════════
//  404 & ERROR HANDLER
// ════════════════════════════════════════════════════════
app.use((req, res) => res.status(404).json({ error: 'Endpoint tidak ditemukan' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 TacticBord Backend jalan di http://localhost:${PORT}`);
  console.log(`   AI Chat: ${ANTHROPIC_API_KEY ? 'terkonfigurasi ✓' : 'BELUM ada ANTHROPIC_API_KEY ✗'}`);
});
