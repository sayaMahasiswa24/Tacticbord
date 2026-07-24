// ════════════════════════════════════════════════════════
//  controllers/tactics.controller.js
// ════════════════════════════════════════════════════════
import db from '../db/index.js';

export function listTactics(req, res) {
  const rows = db.prepare('SELECT id, name, note, formation_id, formation_name, created_at FROM saved_tactics ORDER BY created_at DESC').all();
  res.json(rows);
}

export function getTactic(req, res) {
  const row = db.prepare('SELECT * FROM saved_tactics WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Taktik tidak ditemukan' });
  res.json({
    ...row,
    roles: JSON.parse(row.roles_json),
    positions: JSON.parse(row.positions_json),
    drawings: row.drawings_json ? JSON.parse(row.drawings_json) : [],
  });
}

export function createTactic(req, res) {
  const { name, note, formationId, formationName, roles, positions, drawings } = req.body;
  if (!name || !formationId) return res.status(400).json({ error: 'name dan formationId wajib diisi' });
  const info = db.prepare(`
    INSERT INTO saved_tactics (name, note, formation_id, formation_name, roles_json, positions_json, drawings_json)
    VALUES (?,?,?,?,?,?,?)
  `).run(
    name, note || null, formationId, formationName || formationId,
    JSON.stringify(roles || {}), JSON.stringify(positions || []), JSON.stringify(drawings || [])
  );
  res.status(201).json({ id: Number(info.lastInsertRowid), message: 'Taktik tersimpan' });
}

export function deleteTactic(req, res) {
  const info = db.prepare('DELETE FROM saved_tactics WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Taktik tidak ditemukan' });
  res.json({ message: 'Taktik dihapus' });
}
