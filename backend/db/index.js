// ════════════════════════════════════════════════════════
//  db/index.js — Koneksi database + auto-seed
//  Menggunakan node:sqlite bawaan Node.js 22+ (tidak perlu
//  kompilasi native seperti better-sqlite3 — jauh lebih aman
//  untuk image Docker yang ringan).
// ════════════════════════════════════════════════════════
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.DATA_DIR || join(__dirname, '..', 'data');
const DB_PATH = join(DATA_DIR, 'tacticbord.db');

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// ── Jalankan schema.sql ──
const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
db.exec(schema);

// ── Auto-seed role_master & zone_coordinate_map jika kosong ──
function count(table) {
  return db.prepare(`SELECT COUNT(*) as c FROM ${table}`).get().c;
}

function seedRoles() {
  if (count('role_master') > 0) return;
  const roles = JSON.parse(readFileSync(join(__dirname, 'roles-data.json'), 'utf-8'));
  const insert = db.prepare(`
    INSERT INTO role_master
    (role_id, role_name, short_name, pos_type, pos_group, valid_side, valid_formations,
     width_tendency, depth_tendency, attacking_run, drops_deep, overlap_tendency,
     pressing_intensity, fills_runner_space, attack_set_piece, defend_set_piece, description)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);
  const insertMany = db.transaction((items) => {
    for (const r of items) {
      insert.run(
        r.id, r.name, r.short, r.posType, r.posGroup, r.side, r.formations,
        r.width, r.depth, r.attackingRun ? 1 : 0, r.dropsDeep ? 1 : 0, r.overlap,
        r.pressing, r.fillsSpace ? 1 : 0, r.attackSP ? 1 : 0, r.defendSP, r.desc
      );
    }
  });
  insertMany(roles);
  console.log(`✓ Seeded ${roles.length} roles ke role_master`);
}

function seedZones() {
  if (count('zone_coordinate_map') > 0) return;
  const zones = JSON.parse(readFileSync(join(__dirname, 'zones-data.json'), 'utf-8'));
  const insert = db.prepare(`
    INSERT INTO zone_coordinate_map
    (zone_key, zone_name, side, base_rel_x, base_rel_y, x_variance, y_variance, depth_line)
    VALUES (?,?,?,?,?,?,?,?)
  `);
  const insertMany = db.transaction((items) => {
    for (const z of items) {
      insert.run(z.key, z.name, z.side, z.x, z.y, z.xv, z.yv, z.depthLine);
    }
  });
  insertMany(zones);
  console.log(`✓ Seeded ${zones.length} zones ke zone_coordinate_map`);
}

// db.transaction butuh helper karena node:sqlite belum punya API .transaction() native
// seperti better-sqlite3 — kita buat polyfill sederhana:
if (!db.transaction) {
  db.transaction = (fn) => {
    return (...args) => {
      db.exec('BEGIN');
      try {
        const result = fn(...args);
        db.exec('COMMIT');
        return result;
      } catch (err) {
        db.exec('ROLLBACK');
        throw err;
      }
    };
  };
}

seedRoles();
seedZones();

export default db;
