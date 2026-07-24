// ════════════════════════════════════════════════════════
//  middleware/errorHandler.js
// ════════════════════════════════════════════════════════

export function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Endpoint tidak ditemukan' });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  // SQLite constraint errors (mis. UNIQUE/FOREIGN KEY) → 400, bukan 500
  if (err.message?.includes('UNIQUE constraint') || err.message?.includes('FOREIGN KEY constraint')) {
    return res.status(400).json({ error: 'Data melanggar batasan integritas: ' + err.message });
  }
  res.status(500).json({ error: 'Internal server error' });
}
