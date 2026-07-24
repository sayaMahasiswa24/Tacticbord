// ════════════════════════════════════════════════════════
//  routes/stylePresets.routes.js
// ════════════════════════════════════════════════════════
import { Router } from 'express';
import {
  listStylePresets, getStylePreset, createStylePreset,
  updateStylePreset, updateStylePresetRole, deleteStylePreset,
} from '../controllers/stylePresets.controller.js';

const router = Router();

router.get('/', listStylePresets);
router.post('/', createStylePreset);
router.get('/:styleId', getStylePreset);
router.put('/:styleId', updateStylePreset);
router.put('/:styleId/roles/:slot', updateStylePresetRole);
router.delete('/:styleId', deleteStylePreset);

export default router;
