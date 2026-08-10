import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import db from '../index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const datsetDir = join(__dirname, '../../..', 'datset');

// Simple CSV parser supporting quotes
function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length === 0) return [];
  const headers = lines[0].trim().split(',');
  const results = [];
  for (let i = 1; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;
    let inQuotes = false;
    let col = '';
    const cols = [];
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"' && line[c+1] === '"') {
        col += '"'; c++;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        cols.push(col); col = '';
      } else {
        col += char;
      }
    }
    cols.push(col);
    const row = {};
    headers.forEach((h, idx) => { row[h.trim()] = cols[idx] === undefined ? null : (cols[idx] === '' ? null : cols[idx]); });
    results.push(row);
  }
  return results;
}

function importPhaseMovement() {
  const validRoles = new Set(db.prepare('SELECT role_id FROM role_master').all().map(r => r.role_id));
  const files = readdirSync(datsetDir).filter(f => f.startsWith('role_phase_movement') && f.endsWith('.csv'));
  const insert = db.prepare(`
    INSERT OR IGNORE INTO role_phase_movement 
    (role_id, phase, primary_zone, secondary_zone, depth_line, lateral_bias, vertical_bias, start_delay_sec, move_duration_sec, easing, max_displacement, transition_movement, golden_window_behavior, win_ball_delay_sec, lose_ball_delay_sec)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);
  let count = 0;
  db.transaction(() => {
    for (const file of files) {
      const rows = parseCSV(readFileSync(join(datsetDir, file), 'utf-8'));
      for (const r of rows) {
        if (!r.role_id || !validRoles.has(r.role_id)) continue;
        insert.run(
          r.role_id, r.phase, r.primary_zone, r.secondary_zone, r.depth_line, 
          r.lateral_bias ? parseFloat(r.lateral_bias) : null,
          r.vertical_bias ? parseFloat(r.vertical_bias) : null,
          r.start_delay_sec ? parseFloat(r.start_delay_sec) : null,
          r.move_duration_sec ? parseFloat(r.move_duration_sec) : null,
          r.easing,
          r.max_displacement ? parseFloat(r.max_displacement) : null,
          r.transition_movement, r.golden_window_behavior,
          r.win_ball_delay_sec ? parseFloat(r.win_ball_delay_sec) : null,
          r.lose_ball_delay_sec ? parseFloat(r.lose_ball_delay_sec) : null
        );
        count++;
      }
    }
  })();
  console.log(`✓ Seeded ${count} rows into role_phase_movement`);
}

function importConditionalRules() {
  const validRoles = new Set(db.prepare('SELECT role_id FROM role_master').all().map(r => r.role_id));
  const file = join(datsetDir, 'role_conditional_rules.csv');
  if (!existsSync(file)) return;
  const insert = db.prepare(`
    INSERT OR REPLACE INTO role_conditional_rules 
    (rule_id, role_id, phase, priority, watch_side, watch_pos_type, partner_roles_trigger, override_primary_zone, override_depth_line, override_lateral_bias, override_vertical_bias, override_start_delay, notes)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);
  let count = 0;
  db.transaction(() => {
    const rows = parseCSV(readFileSync(file, 'utf-8'));
    for (const r of rows) {
      if (!r.rule_id || !validRoles.has(r.role_id)) continue;
      insert.run(
        r.rule_id, r.role_id, r.phase, parseInt(r.priority), r.watch_side, r.watch_pos_type, r.partner_roles_trigger,
        r.override_primary_zone, r.override_depth_line, 
        r.override_lateral_bias ? parseFloat(r.override_lateral_bias) : null,
        r.override_vertical_bias ? parseFloat(r.override_vertical_bias) : null,
        r.override_start_delay ? parseFloat(r.override_start_delay) : null,
        r.notes
      );
      count++;
    }
  })();
  console.log(`✓ Seeded ${count} rows into role_conditional_rules`);
}

function importFormationOverride() {
  const validRoles = new Set(db.prepare('SELECT role_id FROM role_master').all().map(r => r.role_id));
  const file = join(datsetDir, 'role_formation_override.csv');
  if (!existsSync(file)) return;
  const insert = db.prepare(`
    INSERT OR REPLACE INTO role_formation_override 
    (override_id, role_id, formation_id, phase, override_lateral_bias, override_vertical_bias, override_depth_line, override_start_delay, override_duration, notes)
    VALUES (?,?,?,?,?,?,?,?,?,?)
  `);
  let count = 0;
  db.transaction(() => {
    const rows = parseCSV(readFileSync(file, 'utf-8'));
    for (const r of rows) {
      if (!r.override_id || !validRoles.has(r.role_id)) continue;
      insert.run(
        r.override_id, r.role_id, r.formation_id, r.phase,
        r.override_lateral_bias ? parseFloat(r.override_lateral_bias) : null,
        r.override_vertical_bias ? parseFloat(r.override_vertical_bias) : null,
        r.override_depth_line, 
        r.override_start_delay ? parseFloat(r.override_start_delay) : null,
        r.override_duration ? parseFloat(r.override_duration) : null,
        r.notes
      );
      count++;
    }
  })();
  console.log(`✓ Seeded ${count} rows into role_formation_override`);
}

importPhaseMovement();
importConditionalRules();
importFormationOverride();

console.log('Seeding from CSVs completed.');
