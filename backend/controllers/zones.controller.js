// ════════════════════════════════════════════════════════
//  controllers/zones.controller.js
// ════════════════════════════════════════════════════════
import db from '../db/index.js';
import { toZoneDTO } from '../utils/dto.js';

// GET /api/zones?name=zone_10&side=left
export function listZones(req, res) {
  const { name, side } = req.query;
  let sql = 'SELECT * FROM zone_coordinate_map WHERE 1=1';
  const params = [];
  if (name) { sql += ' AND zone_name = ?'; params.push(name); }
  if (side) { sql += ' AND side = ?'; params.push(side); }
  const rows = db.prepare(sql).all(...params);
  res.json(rows.map(toZoneDTO));
}

// GET /api/zones/:zoneKey
export function getZone(req, res) {
  const row = db.prepare('SELECT * FROM zone_coordinate_map WHERE zone_key = ?').get(req.params.zoneKey);
  if (!row) return res.status(404).json({ error: 'Zona tidak ditemukan' });
  res.json(toZoneDTO(row));
}

// PUT /api/zones/:zoneKey — update koordinat zona
export function updateZone(req, res) {
  const existing = db.prepare('SELECT * FROM zone_coordinate_map WHERE zone_key = ?').get(req.params.zoneKey);
  if (!existing) return res.status(404).json({ error: 'Zona tidak ditemukan' });

  const merged = { ...toZoneDTO(existing), ...req.body };
  db.prepare(`
    UPDATE zone_coordinate_map SET
      base_rel_x=?, base_rel_y=?, x_variance=?, y_variance=?, depth_line=?
    WHERE zone_key = ?
  `).run(merged.x, merged.y, merged.xv, merged.yv, merged.depthLine, req.params.zoneKey);

  const updated = db.prepare('SELECT * FROM zone_coordinate_map WHERE zone_key = ?').get(req.params.zoneKey);
  res.json(toZoneDTO(updated));
}
