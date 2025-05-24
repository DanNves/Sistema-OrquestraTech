import { Router } from 'express';
import * as inscricaoController from '../controllers/inscricao.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

// GET routes can be public or protected depending on requirements
// For now, let's assume GET routes are public to allow viewing of inscriptions
router.get('/', inscricaoController.getAllInscricoes); // Filters via query params
router.get('/:id', inscricaoController.getInscricaoById);

// POST, PUT, DELETE routes are protected
const adminAndOrganizerRoles: ('SuperAdmin' | 'Organizador')[] = ['SuperAdmin', 'Organizador'];

// Users might create their own inscriptions - this would need a different auth logic (e.g. protect for any logged-in user)
// For now, only Admins/Organizers can create/manage.
router.post('/', protect, authorize(adminAndOrganizerRoles), inscricaoController.createInscricao);
router.put('/:id/status', protect, authorize(adminAndOrganizerRoles), inscricaoController.updateInscricaoStatus);
router.delete('/:id', protect, authorize(adminAndOrganizerRoles), inscricaoController.deleteInscricao);

// Note: The PUT route for updating status is more specific than a general PUT /:id
// If general updates to an inscricao (other than status) were needed, a PUT /:id route could be added.

export default router;
