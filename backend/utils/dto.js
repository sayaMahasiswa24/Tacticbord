// ════════════════════════════════════════════════════════
//  utils/dto.js — Transformasi baris SQLite (snake_case, 0/1)
//  menjadi bentuk JSON yang siap dipakai frontend (camelCase,
//  boolean asli). Satu tempat, dipakai semua controller.
// ════════════════════════════════════════════════════════

export function toRoleDTO(row) {
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

// Kebalikan dari toRoleDTO — untuk terima payload dari frontend (POST/PUT)
// dan ubah jadi bentuk yang siap di-bind ke statement SQL.
export function fromRoleDTO(body) {
  return {
    role_id: body.id,
    role_name: body.name,
    short_name: body.short,
    pos_type: body.posType,
    pos_group: body.posGroup,
    valid_side: body.side,
    valid_formations: body.formations,
    width_tendency: body.width,
    depth_tendency: body.depth,
    attacking_run: body.attackingRun ? 1 : 0,
    drops_deep: body.dropsDeep ? 1 : 0,
    overlap_tendency: body.overlap,
    pressing_intensity: body.pressing,
    fills_runner_space: body.fillsSpace ? 1 : 0,
    attack_set_piece: body.attackSP ? 1 : 0,
    defend_set_piece: body.defendSP,
    description: body.desc,
  };
}

export function toZoneDTO(row) {
  return {
    key: row.zone_key, name: row.zone_name, side: row.side,
    x: row.base_rel_x, y: row.base_rel_y,
    xv: row.x_variance, yv: row.y_variance, depthLine: row.depth_line,
  };
}

// Menggabungkan baris `formations` + seluruh `formation_players` miliknya
// menjadi satu object { id, name, players: [...] } — bentuk yang sama
// persis dengan FORMATIONS[fid] yang dulu di-hardcode di frontend.
export function toFormationDTO(formationRow, playerRows) {
  return {
    id: formationRow.formation_id,
    name: formationRow.name,
    players: playerRows
      .sort((a, b) => a.player_slot - b.player_slot)
      .map(p => ({ id: p.player_slot, posType: p.pos_type, side: p.side, x: p.base_rel_x, y: p.base_rel_y })),
  };
}

// Sama polanya untuk style preset — gabungkan style_presets + style_preset_roles
export function toStylePresetDTO(styleRow, roleRows) {
  const roles = {};
  roleRows.forEach(r => { roles[r.player_slot] = r.role_id; });
  return {
    id: styleRow.style_id,
    name: styleRow.name,
    emoji: styleRow.emoji,
    formation: styleRow.formation_id,
    desc: styleRow.description,
    modifiers: {
      widthMult: styleRow.width_mult,
      depthMult: styleRow.depth_mult,
      tempoMult: styleRow.tempo_mult,
      pressBoost: styleRow.press_boost,
    },
    roles,
  };
}
