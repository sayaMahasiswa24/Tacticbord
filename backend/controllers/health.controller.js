// ════════════════════════════════════════════════════════
//  controllers/health.controller.js
// ════════════════════════════════════════════════════════
import db from '../db/index.js';

export function getHealth(req, res) {
  res.json({
    status: 'ok',
    roles: db.prepare('SELECT COUNT(*) c FROM role_master').get().c,
    zones: db.prepare('SELECT COUNT(*) c FROM zone_coordinate_map').get().c,
    formations: db.prepare('SELECT COUNT(*) c FROM formations').get().c,
    stylePresets: db.prepare('SELECT COUNT(*) c FROM style_presets').get().c,
    savedTactics: db.prepare('SELECT COUNT(*) c FROM saved_tactics').get().c,
    aiConfigured: !!process.env.ANTHROPIC_API_KEY,
  });
}
