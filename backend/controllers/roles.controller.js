// ════════════════════════════════════════════════════════
//  controllers/roles.controller.js — CRUD lengkap role_master
// ════════════════════════════════════════════════════════
import db from '../db/index.js';
import { toRoleDTO, fromRoleDTO } from '../utils/dto.js';

const VALID_POS_TYPES = ['GK', 'CB', 'FB', 'WB', 'DM', 'CM', 'AM', 'W', 'CF'];
const VALID_POS_GROUPS = ['GK', 'DEF', 'MID', 'FWD'];
const VALID_SIDES = ['left', 'right', 'both', 'center'];
const VALID_OVERLAP = ['overlap', 'underlap', 'none'];
const VALID_PRESSING = ['immediate', 'delayed', 'hold'];

function validateRolePayload(body, isUpdate = false) {
  const errors = [];
  const required = isUpdate
    ? []
    : ['id', 'name', 'short', 'posType', 'posGroup', 'side', 'formations', 'width', 'depth', 'desc'];
  for (const field of required) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      errors.push(`Field "${field}" wajib diisi`);
    }
  }
  if (body.posType !== undefined && !VALID_POS_TYPES.includes(body.posType)) {
    errors.push(`posType harus salah satu dari: ${VALID_POS_TYPES.join(', ')}`);
  }
  if (body.posGroup !== undefined && !VALID_POS_GROUPS.includes(body.posGroup)) {
    errors.push(`posGroup harus salah satu dari: ${VALID_POS_GROUPS.join(', ')}`);
  }
  if (body.side !== undefined && !VALID_SIDES.includes(body.side)) {
    errors.push(`side harus salah satu dari: ${VALID_SIDES.join(', ')}`);
  }
  if (body.overlap !== undefined && !VALID_OVERLAP.includes(body.overlap)) {
    errors.push(`overlap harus salah satu dari: ${VALID_OVERLAP.join(', ')}`);
  }
  if (body.pressing !== undefined && !VALID_PRESSING.includes(body.pressing)) {
    errors.push(`pressing harus salah satu dari: ${VALID_PRESSING.join(', ')}`);
  }
  if (body.width !== undefined && (body.width < 0 || body.width > 1)) {
    errors.push('width harus di antara 0.0 dan 1.0');
  }
  if (body.depth !== undefined && (body.depth < 0 || body.depth > 1)) {
    errors.push('depth harus di antara 0.0 dan 1.0');
  }
  return errors;
}

// GET /api/roles?posType=CB&search=press
export function listRoles(req, res) {
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
}

// GET /api/roles/:roleId
export function getRole(req, res) {
  const row = db.prepare('SELECT * FROM role_master WHERE role_id = ?').get(req.params.roleId);
  if (!row) return res.status(404).json({ error: 'Role tidak ditemukan' });
  res.json(toRoleDTO(row));
}

// POST /api/roles — buat role baru
export function createRole(req, res) {
  const errors = validateRolePayload(req.body, false);
  if (errors.length) return res.status(400).json({ error: 'Validasi gagal', details: errors });

  const existing = db.prepare('SELECT role_id FROM role_master WHERE role_id = ?').get(req.body.id);
  if (existing) return res.status(409).json({ error: `Role dengan id "${req.body.id}" sudah ada` });

  const d = fromRoleDTO(req.body);
  db.prepare(`
    INSERT INTO role_master
    (role_id, role_name, short_name, pos_type, pos_group, valid_side, valid_formations,
     width_tendency, depth_tendency, attacking_run, drops_deep, overlap_tendency,
     pressing_intensity, fills_runner_space, attack_set_piece, defend_set_piece, description)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).run(
    d.role_id, d.role_name, d.short_name, d.pos_type, d.pos_group, d.valid_side, d.valid_formations,
    d.width_tendency, d.depth_tendency, d.attacking_run, d.drops_deep, d.overlap_tendency,
    d.pressing_intensity, d.fills_runner_space, d.attack_set_piece, d.defend_set_piece, d.description
  );
  const created = db.prepare('SELECT * FROM role_master WHERE role_id = ?').get(d.role_id);
  res.status(201).json(toRoleDTO(created));
}

// PUT /api/roles/:roleId — update sebagian atau seluruh field
export function updateRole(req, res) {
  const existing = db.prepare('SELECT * FROM role_master WHERE role_id = ?').get(req.params.roleId);
  if (!existing) return res.status(404).json({ error: 'Role tidak ditemukan' });

  const errors = validateRolePayload(req.body, true);
  if (errors.length) return res.status(400).json({ error: 'Validasi gagal', details: errors });

  // Merge: field yang tidak dikirim tetap pakai nilai lama (partial update)
  const merged = { ...toRoleDTO(existing), ...req.body };
  const d = fromRoleDTO(merged);

  db.prepare(`
    UPDATE role_master SET
      role_name=?, short_name=?, pos_type=?, pos_group=?, valid_side=?, valid_formations=?,
      width_tendency=?, depth_tendency=?, attacking_run=?, drops_deep=?, overlap_tendency=?,
      pressing_intensity=?, fills_runner_space=?, attack_set_piece=?, defend_set_piece=?, description=?
    WHERE role_id = ?
  `).run(
    d.role_name, d.short_name, d.pos_type, d.pos_group, d.valid_side, d.valid_formations,
    d.width_tendency, d.depth_tendency, d.attacking_run, d.drops_deep, d.overlap_tendency,
    d.pressing_intensity, d.fills_runner_space, d.attack_set_piece, d.defend_set_piece, d.description,
    req.params.roleId
  );
  const updated = db.prepare('SELECT * FROM role_master WHERE role_id = ?').get(req.params.roleId);
  res.json(toRoleDTO(updated));
}

// DELETE /api/roles/:roleId
export function deleteRole(req, res) {
  // Cegah hapus role yang masih dipakai style_preset_roles (jaga integritas data)
  const usedByStyle = db.prepare('SELECT style_id FROM style_preset_roles WHERE role_id = ? LIMIT 1').get(req.params.roleId);
  if (usedByStyle) {
    return res.status(409).json({ error: `Role masih dipakai oleh preset gaya bermain "${usedByStyle.style_id}" — lepas dulu dari preset tersebut sebelum menghapus.` });
  }
  const info = db.prepare('DELETE FROM role_master WHERE role_id = ?').run(req.params.roleId);
  if (info.changes === 0) return res.status(404).json({ error: 'Role tidak ditemukan' });
  res.json({ message: 'Role dihapus' });
}

// GET /api/roles/:roleId/movement (tabel role_phase_movement — kalau sudah diisi)
export function getRoleMovement(req, res) {
  const rows = db.prepare('SELECT * FROM role_phase_movement WHERE role_id = ?').all(req.params.roleId);
  res.json(rows);
}

// GET /api/roles/:roleId/rules (tabel role_conditional_rules)
export function getRoleRules(req, res) {
  const rows = db.prepare('SELECT * FROM role_conditional_rules WHERE role_id = ? ORDER BY priority').all(req.params.roleId);
  res.json(rows);
}
