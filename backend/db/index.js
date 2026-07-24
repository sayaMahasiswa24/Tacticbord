// ════════════════════════════════════════════════════════
//  db/index.js — Koneksi database + orkestrasi auto-seed
//  Menggunakan node:sqlite bawaan Node.js 22+ (tidak perlu
//  kompilasi native seperti better-sqlite3 — jauh lebih aman
//  untuk image Docker yang ringan).
// ════════════════════════════════════════════════════════
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { runAllSeeds } from './seed/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.DATA_DIR || join(__dirname, '..', 'data');
const DB_PATH = join(DATA_DIR, 'tacticbord.db');

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// ── Jalankan schema.sql (idempotent — CREATE TABLE IF NOT EXISTS) ──
const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
db.exec(schema);

// ── Polyfill db.transaction() — node:sqlite belum punya API ini
//    secara native seperti better-sqlite3 ──
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

// ── Auto-seed seluruh tabel referensi (role_master, zone_coordinate_map,
//    formations, style_presets) — hanya mengisi yang masih kosong ──
runAllSeeds(db);

export default db;
