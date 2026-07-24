// ════════════════════════════════════════════════════════
//  server.js — Composition root. Hanya menyusun middleware
//  & routes; seluruh logika bisnis ada di controllers/.
// ════════════════════════════════════════════════════════
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import healthRoutes from './routes/health.routes.js';
import rolesRoutes from './routes/roles.routes.js';
import zonesRoutes from './routes/zones.routes.js';
import formationsRoutes from './routes/formations.routes.js';
import stylePresetsRoutes from './routes/stylePresets.routes.js';
import tacticsRoutes from './routes/tactics.routes.js';
import chatRoutes from './routes/chat.routes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 8787;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

app.use(cors({ origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN.split(',') }));
app.use(express.json({ limit: '1mb' }));

app.use('/api/health', healthRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/zones', zonesRoutes);
app.use('/api/formations', formationsRoutes);
app.use('/api/style-presets', stylePresetsRoutes);
app.use('/api/tactics', tacticsRoutes);
app.use('/api/chat', chatRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 TacticBord Backend jalan di http://localhost:${PORT}`);
  console.log(`   AI Chat: ${process.env.ANTHROPIC_API_KEY ? 'terkonfigurasi ✓' : 'BELUM ada ANTHROPIC_API_KEY ✗'}`);
});
