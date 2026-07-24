// ════════════════════════════════════════════════════════
//  db/seed/index.js — Seluruh logika auto-seed database
//  Dipanggil sekali saat server start; hanya mengisi tabel
//  yang masih kosong (aman dipanggil berkali-kali / restart).
// ════════════════════════════════════════════════════════
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedFile = (name) => JSON.parse(readFileSync(join(__dirname, name), 'utf-8'));

function count(db, table) {
  return db.prepare(`SELECT COUNT(*) as c FROM ${table}`).get().c;
}

function seedRoles(db) {
  if (count(db, 'role_master') > 0) return;
  const roles = seedFile('roles-data.json');
  const insert = db.prepare(`
    INSERT INTO role_master
    (role_id, role_name, short_name, pos_type, pos_group, valid_side, valid_formations,
     width_tendency, depth_tendency, attacking_run, drops_deep, overlap_tendency,
     pressing_intensity, fills_runner_space, attack_set_piece, defend_set_piece, description)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);
  db.transaction(() => {
    for (const r of roles) {
      insert.run(
        r.id, r.name, r.short, r.posType, r.posGroup, r.side, r.formations,
        r.width, r.depth, r.attackingRun ? 1 : 0, r.dropsDeep ? 1 : 0, r.overlap,
        r.pressing, r.fillsSpace ? 1 : 0, r.attackSP ? 1 : 0, r.defendSP, r.desc
      );
    }
  })();
  console.log(`✓ Seeded ${roles.length} roles ke role_master`);
}

function seedZones(db) {
  if (count(db, 'zone_coordinate_map') > 0) return;
  const zones = seedFile('zones-data.json');
  const insert = db.prepare(`
    INSERT INTO zone_coordinate_map
    (zone_key, zone_name, side, base_rel_x, base_rel_y, x_variance, y_variance, depth_line)
    VALUES (?,?,?,?,?,?,?,?)
  `);
  db.transaction(() => {
    for (const z of zones) insert.run(z.key, z.name, z.side, z.x, z.y, z.xv, z.yv, z.depthLine);
  })();
  console.log(`✓ Seeded ${zones.length} zones ke zone_coordinate_map`);
}

function seedFormations(db) {
  if (count(db, 'formations') > 0) return;
  const formations = seedFile('formations-data.json');
  const formationPlayers = seedFile('formation-players-data.json');

  const insertF = db.prepare(`INSERT INTO formations (formation_id, name, display_order) VALUES (?,?,?)`);
  const insertFP = db.prepare(`
    INSERT INTO formation_players (formation_id, player_slot, pos_type, side, base_rel_x, base_rel_y)
    VALUES (?,?,?,?,?,?)
  `);
  db.transaction(() => {
    for (const f of formations) insertF.run(f.formation_id, f.name, f.display_order);
    for (const p of formationPlayers) {
      insertFP.run(p.formation_id, p.player_slot, p.pos_type, p.side, p.base_rel_x, p.base_rel_y);
    }
  })();
  console.log(`✓ Seeded ${formations.length} formations (${formationPlayers.length} slot pemain)`);
}

function seedStylePresets(db) {
  if (count(db, 'style_presets') > 0) return;
  const styles = seedFile('style-presets-data.json');
  const styleRoles = seedFile('style-preset-roles-data.json');

  const insertS = db.prepare(`
    INSERT INTO style_presets
    (style_id, name, emoji, formation_id, description, width_mult, depth_mult, tempo_mult, press_boost, display_order)
    VALUES (?,?,?,?,?,?,?,?,?,?)
  `);
  const insertSR = db.prepare(`INSERT INTO style_preset_roles (style_id, player_slot, role_id) VALUES (?,?,?)`);
  db.transaction(() => {
    for (const s of styles) {
      insertS.run(s.style_id, s.name, s.emoji, s.formation_id, s.description,
        s.width_mult, s.depth_mult, s.tempo_mult, s.press_boost, s.display_order);
    }
    for (const r of styleRoles) insertSR.run(r.style_id, r.player_slot, r.role_id);
  })();
  console.log(`✓ Seeded ${styles.length} style presets (${styleRoles.length} penugasan peran)`);
}

export function runAllSeeds(db) {
  seedRoles(db);
  seedZones(db);
  seedFormations(db);
  seedStylePresets(db);
}
