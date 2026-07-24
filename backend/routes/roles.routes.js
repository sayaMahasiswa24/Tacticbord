// ════════════════════════════════════════════════════════
//  routes/roles.routes.js
// ════════════════════════════════════════════════════════
import { Router } from 'express';
import {
  listRoles, getRole, createRole, updateRole, deleteRole,
  getRoleMovement, getRoleRules,
} from '../controllers/roles.controller.js';

const router = Router();

router.get('/', listRoles);
router.post('/', createRole);
router.get('/:roleId', getRole);
router.put('/:roleId', updateRole);
router.delete('/:roleId', deleteRole);
router.get('/:roleId/movement', getRoleMovement);
router.get('/:roleId/rules', getRoleRules);

export default router;
