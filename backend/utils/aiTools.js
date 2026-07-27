// ════════════════════════════════════════════════════════
//  utils/aiTools.js — Tool-use untuk AI Tactical Assistant.
//  Alih-alih menjejalkan seluruh role_master ke prompt, Claude
//  diberi "tools" untuk query database sesuai kebutuhan —
//  lebih akurat & lebih murah token untuk dataset terstruktur
//  seperti ini (dibanding vector-embedding RAG).
// ════════════════════════════════════════════════════════
import db from '../db/index.js';
import { toRoleDTO, toFormationDTO, toStylePresetDTO } from './dto.js';

// ── Skema tool yang dikirim ke Anthropic API ──
export const AI_TOOLS = [
  {
    name: 'search_roles',
    description: 'Cari role pemain di database berdasarkan kata kunci dan/atau posisi. ' +
      'Pakai ini kalau user tanya "role apa yang cocok untuk..." tanpa menyebut role_id spesifik. ' +
      'PENTING: deskripsi role di database dalam Bahasa Indonesia — gunakan kata kunci Bahasa Indonesia, ' +
      'contoh: "turun" (bukan "drop deep"), "bawa bola" (bukan "ball playing"), "tekel" (bukan "tackling"). ' +
      'Kalau query pertama tidak ketemu, coba sinonim Bahasa Indonesia lain sebelum menyerah.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Kata kunci pencarian dalam Bahasa Indonesia, di nama atau deskripsi role' },
        posType: {
          type: 'string',
          enum: ['GK', 'CB', 'FB', 'WB', 'DM', 'CM', 'AM', 'W', 'CF'],
          description: 'Filter berdasarkan posisi (opsional)',
        },
      },
    },
  },
  {
    name: 'get_role_detail',
    description: 'Ambil detail lengkap satu role berdasarkan role_id — seluruh atribut taktisnya ' +
      '(width, depth, pressing, overlap, dsb). Pakai setelah tahu role_id pasti, misal dari hasil search_roles.',
    input_schema: {
      type: 'object',
      properties: { roleId: { type: 'string', description: 'ID role, contoh: false_nine, regista' } },
      required: ['roleId'],
    },
  },
  {
    name: 'get_role_rules',
    description: 'Ambil conditional rules (aturan reaktif terhadap peran rekan setim) untuk satu role. ' +
      'Berguna kalau user tanya soal interaksi antar role, misal "kapan inverted winger masuk half-space".',
    input_schema: {
      type: 'object',
      properties: { roleId: { type: 'string' } },
      required: ['roleId'],
    },
  },
  {
    name: 'list_style_presets',
    description: 'Ambil daftar semua preset gaya bermain (Tiki-Taka, Gegenpressing, Catenaccio, dst) ' +
      'beserta formasi dan modifier taktisnya. Pakai kalau user tanya rekomendasi gaya bermain.',
    input_schema: { type: 'object', properties: {} },
  },
  {
    name: 'get_formation',
    description: 'Ambil detail susunan 11 slot pemain (posisi & koordinat) untuk satu formasi tertentu.',
    input_schema: {
      type: 'object',
      properties: { formationId: { type: 'string', description: 'Contoh: 433, 4231, 352' } },
      required: ['formationId'],
    },
  },
];

// ── Eksekusi tool call — semua query pakai db yang sudah ada, tidak ada logika baru ──
export function executeTool(name, input) {
  try {
    switch (name) {
      case 'search_roles': {
        const { query, posType } = input;
        let sql = 'SELECT * FROM role_master WHERE 1=1';
        const params = [];
        if (posType) { sql += ' AND pos_type = ?'; params.push(posType); }
        if (query) {
          sql += ' AND (role_name LIKE ? OR description LIKE ?)';
          params.push(`%${query}%`, `%${query}%`);
        }
        sql += ' LIMIT 8';
        const rows = db.prepare(sql).all(...params);
        return { count: rows.length, roles: rows.map(toRoleDTO) };
      }

      case 'get_role_detail': {
        const row = db.prepare('SELECT * FROM role_master WHERE role_id = ?').get(input.roleId);
        if (!row) return { error: `Role "${input.roleId}" tidak ditemukan` };
        return toRoleDTO(row);
      }

      case 'get_role_rules': {
        const rows = db.prepare('SELECT * FROM role_conditional_rules WHERE role_id = ? ORDER BY priority').all(input.roleId);
        return { count: rows.length, rules: rows };
      }

      case 'list_style_presets': {
        const styles = db.prepare('SELECT * FROM style_presets ORDER BY display_order').all();
        const result = styles.map(s => {
          const roles = db.prepare('SELECT * FROM style_preset_roles WHERE style_id = ?').all(s.style_id);
          return toStylePresetDTO(s, roles);
        });
        return { count: result.length, stylePresets: result };
      }

      case 'get_formation': {
        const f = db.prepare('SELECT * FROM formations WHERE formation_id = ?').get(input.formationId);
        if (!f) return { error: `Formasi "${input.formationId}" tidak ditemukan` };
        const players = db.prepare('SELECT * FROM formation_players WHERE formation_id = ?').all(f.formation_id);
        return toFormationDTO(f, players);
      }

      default:
        return { error: `Tool tidak dikenal: ${name}` };
    }
  } catch (err) {
    return { error: `Gagal eksekusi tool ${name}: ${err.message}` };
  }
}
