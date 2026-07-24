// ════════════════════════════════════════════════════════
//  controllers/stylePresets.controller.js
// ════════════════════════════════════════════════════════
import db from '../db/index.js';
import { toStylePresetDTO } from '../utils/dto.js';

// GET /api/style-presets
export function listStylePresets(req, res) {
  const styles = db.prepare('SELECT * FROM style_presets ORDER BY display_order').all();
  const result = {};
  for (const s of styles) {
    const roles = db.prepare('SELECT * FROM style_preset_roles WHERE style_id = ?').all(s.style_id);
    result[s.style_id] = toStylePresetDTO(s, roles);
  }
  res.json(result);
}

// GET /api/style-presets/:styleId
export function getStylePreset(req, res) {
  const s = db.prepare('SELECT * FROM style_presets WHERE style_id = ?').get(req.params.styleId);
  if (!s) return res.status(404).json({ error: 'Gaya bermain tidak ditemukan' });
  const roles = db.prepare('SELECT * FROM style_preset_roles WHERE style_id = ?').all(s.style_id);
  res.json(toStylePresetDTO(s, roles));
}

// POST /api/style-presets — buat gaya bermain baru
export function createStylePreset(req, res) {
  const { id, name, emoji, formation, desc, modifiers, roles } = req.body;
  if (!id || !name || !formation || !desc || !modifiers || !roles) {
    return res.status(400).json({ error: 'Field id, name, formation, desc, modifiers, dan roles wajib diisi' });
  }
  const existing = db.prepare('SELECT style_id FROM style_presets WHERE style_id = ?').get(id);
  if (existing) return res.status(409).json({ error: `Gaya bermain dengan id "${id}" sudah ada` });

  const formationExists = db.prepare('SELECT formation_id FROM formations WHERE formation_id = ?').get(formation);
  if (!formationExists) return res.status(400).json({ error: `Formasi "${formation}" tidak ditemukan` });

  const maxOrder = db.prepare('SELECT MAX(display_order) m FROM style_presets').get().m || 0;

  db.transaction(() => {
    db.prepare(`
      INSERT INTO style_presets (style_id, name, emoji, formation_id, description, width_mult, depth_mult, tempo_mult, press_boost, display_order)
      VALUES (?,?,?,?,?,?,?,?,?,?)
    `).run(id, name, emoji || null, formation, desc,
      modifiers.widthMult ?? 1, modifiers.depthMult ?? 1, modifiers.tempoMult ?? 1, modifiers.pressBoost ?? 0, maxOrder + 1);

    const insertRole = db.prepare('INSERT INTO style_preset_roles (style_id, player_slot, role_id) VALUES (?,?,?)');
    for (const [slot, roleId] of Object.entries(roles)) insertRole.run(id, Number(slot), roleId);
  })();

  const created = db.prepare('SELECT * FROM style_presets WHERE style_id = ?').get(id);
  const createdRoles = db.prepare('SELECT * FROM style_preset_roles WHERE style_id = ?').all(id);
  res.status(201).json(toStylePresetDTO(created, createdRoles));
}

// PUT /api/style-presets/:styleId — update metadata + modifier (bukan penugasan role)
export function updateStylePreset(req, res) {
  const existing = db.prepare('SELECT * FROM style_presets WHERE style_id = ?').get(req.params.styleId);
  if (!existing) return res.status(404).json({ error: 'Gaya bermain tidak ditemukan' });

  const merged = { ...toStylePresetDTO(existing, []), ...req.body };
  const mod = { ...toStylePresetDTO(existing, []).modifiers, ...(req.body.modifiers || {}) };

  db.prepare(`
    UPDATE style_presets SET
      name=?, emoji=?, formation_id=?, description=?, width_mult=?, depth_mult=?, tempo_mult=?, press_boost=?
    WHERE style_id = ?
  `).run(merged.name, merged.emoji, merged.formation, merged.desc,
    mod.widthMult, mod.depthMult, mod.tempoMult, mod.pressBoost, req.params.styleId);

  const updated = db.prepare('SELECT * FROM style_presets WHERE style_id = ?').get(req.params.styleId);
  const roles = db.prepare('SELECT * FROM style_preset_roles WHERE style_id = ?').all(req.params.styleId);
  res.json(toStylePresetDTO(updated, roles));
}

// PUT /api/style-presets/:styleId/roles/:slot — ganti role di satu slot tertentu
export function updateStylePresetRole(req, res) {
  const { styleId, slot } = req.params;
  const { roleId } = req.body;
  if (!roleId) return res.status(400).json({ error: 'roleId wajib diisi' });

  const roleExists = db.prepare('SELECT role_id FROM role_master WHERE role_id = ?').get(roleId);
  if (!roleExists) return res.status(400).json({ error: `Role "${roleId}" tidak ditemukan` });

  const existing = db.prepare('SELECT * FROM style_preset_roles WHERE style_id = ? AND player_slot = ?').get(styleId, slot);
  if (existing) {
    db.prepare('UPDATE style_preset_roles SET role_id = ? WHERE style_id = ? AND player_slot = ?').run(roleId, styleId, slot);
  } else {
    db.prepare('INSERT INTO style_preset_roles (style_id, player_slot, role_id) VALUES (?,?,?)').run(styleId, slot, roleId);
  }
  res.json({ styleId, slot: Number(slot), roleId });
}

// DELETE /api/style-presets/:styleId
export function deleteStylePreset(req, res) {
  db.transaction(() => {
    db.prepare('DELETE FROM style_preset_roles WHERE style_id = ?').run(req.params.styleId);
    db.prepare('DELETE FROM style_presets WHERE style_id = ?').run(req.params.styleId);
  })();
  res.json({ message: 'Gaya bermain dihapus' });
}
