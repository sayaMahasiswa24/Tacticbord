// ════════════════════════════════════════════════════════
//  routes/zones.routes.js
// ════════════════════════════════════════════════════════
import { Router } from 'express';
import { listZones, getZone, updateZone } from '../controllers/zones.controller.js';

const router = Router();

router.get('/', listZones);
router.get('/:zoneKey', getZone);
router.put('/:zoneKey', updateZone);

export default router;
