// ════════════════════════════════════════════════════════
//  controllers/formations.controller.js
// ════════════════════════════════════════════════════════
import db from '../db/index.js';
import { toFormationDTO } from '../utils/dto.js';

// GET /api/formations
// Response berbentuk object keyed-by-id: { "433": {...}, "442": {...} }
// — sengaja disamakan persis dengan FORMATIONS yang dulu hardcoded
// di frontend, supaya migrasi frontend minim perubahan kode.
export function listFormations(req, res) {
  const formations = db.prepare('SELECT * FROM formations ORDER BY display_order').all();
  const result = {};
  for (const f of formations) {
    const players = db.prepare('SELECT * FROM formation_players WHERE formation_id = ?').all(f.formation_id);
    result[f.formation_id] = toFormationDTO(f, players);
  }
  res.json(result);
}

// GET /api/formations/:formationId
export function getFormation(req, res) {
  const f = db.prepare('SELECT * FROM formations WHERE formation_id = ?').get(req.params.formationId);
  if (!f) return res.status(404).json({ error: 'Formasi tidak ditemukan' });
  const players = db.prepare('SELECT * FROM formation_players WHERE formation_id = ?').all(f.formation_id);
  res.json(toFormationDTO(f, players));
}

// PUT /api/formations/:formationId/players/:slot — ubah posisi satu slot pemain
export function updateFormationPlayer(req, res) {
  const { formationId, slot } = req.params;
  const existing = db.prepare('SELECT * FROM formation_players WHERE formation_id = ? AND player_slot = ?').get(formationId, slot);
  if (!existing) return res.status(404).json({ error: 'Slot pemain tidak ditemukan di formasi ini' });

  const { posType, side, x, y } = req.body;
  db.prepare(`
    UPDATE formation_players SET
      pos_type = COALESCE(?, pos_type),
      side = COALESCE(?, side),
      base_rel_x = COALESCE(?, base_rel_x),
      base_rel_y = COALESCE(?, base_rel_y)
    WHERE formation_id = ? AND player_slot = ?
  `).run(posType ?? null, side ?? null, x ?? null, y ?? null, formationId, slot);

  const updated = db.prepare('SELECT * FROM formation_players WHERE formation_id = ? AND player_slot = ?').get(formationId, slot);
  res.json({ id: updated.player_slot, posType: updated.pos_type, side: updated.side, x: updated.base_rel_x, y: updated.base_rel_y });
}
