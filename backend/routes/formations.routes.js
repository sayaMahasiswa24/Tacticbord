// ════════════════════════════════════════════════════════
//  routes/formations.routes.js
// ════════════════════════════════════════════════════════
import { Router } from 'express';
import { listFormations, getFormation, updateFormationPlayer } from '../controllers/formations.controller.js';

const router = Router();

router.get('/', listFormations);
router.get('/:formationId', getFormation);
router.put('/:formationId/players/:slot', updateFormationPlayer);

export default router;
