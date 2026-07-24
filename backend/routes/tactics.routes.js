// ════════════════════════════════════════════════════════
//  routes/tactics.routes.js
// ════════════════════════════════════════════════════════
import { Router } from 'express';
import { listTactics, getTactic, createTactic, deleteTactic } from '../controllers/tactics.controller.js';

const router = Router();

router.get('/', listTactics);
router.post('/', createTactic);
router.get('/:id', getTactic);
router.delete('/:id', deleteTactic);

export default router;
