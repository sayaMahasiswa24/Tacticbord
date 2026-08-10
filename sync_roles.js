import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

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

const csvText = readFileSync('datset/role_master.csv', 'utf-8');
const rows = parseCSV(csvText);

const roleMasterArr = rows.map(r => ({
  id: r.role_id,
  name: r.role_name,
  short: r.short_name,
  posType: r.pos_type,
  posGroup: r.pos_group,
  side: r.valid_side,
  formations: r.valid_formations,
  width: parseFloat(r.width_tendency),
  depth: parseFloat(r.depth_tendency),
  attackingRun: r.attacking_run === 'TRUE',
  dropsDeep: r.drops_deep === 'TRUE',
  overlap: r.overlap_tendency,
  pressing: r.pressing_intensity,
  fillsSpace: r.fills_runner_space === 'TRUE',
  attackSP: r.attack_set_piece === 'TRUE',
  defendSP: r.defend_set_piece,
  desc: r.description
}));

// Update roles-data.json
writeFileSync('backend/db/seed/roles-data.json', JSON.stringify(roleMasterArr, null, 0));

// Update tacticData.js
const tacticDataPath = 'src/data/tacticData.js';
let tacticData = readFileSync(tacticDataPath, 'utf-8');
const regex = /export const ROLE_MASTER = \[([\s\S]*?)\];/;
const replacement = 'export const ROLE_MASTER = ' + JSON.stringify(roleMasterArr, null, 2) + ';';
tacticData = tacticData.replace(regex, replacement);
writeFileSync(tacticDataPath, tacticData);
console.log('Roles synced! count=' + roleMasterArr.length);
