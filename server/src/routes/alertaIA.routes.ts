import { Router } from 'express';
import * as alertaIAController from '../controllers/alertaIA.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

// Secure all AlertaIA routes, accessible by Organizers and SuperAdmins
router.post('/', protect, authorize(['SuperAdmin', 'Organizador']), alertaIAController.createAlertaIA);
router.get('/', protect, authorize(['SuperAdmin', 'Organizador', 'Moderador']), alertaIAController.getAllAlertasIA);
router.get('/:id', protect, authorize(['SuperAdmin', 'Organizador', 'Moderador']), alertaIAController.getAlertaIAById);
router.put('/:id/read', protect, authorize(['SuperAdmin', 'Organizador', 'Moderador']), alertaIAController.markAlertaAsRead);
router.delete('/:id', protect, authorize(['SuperAdmin', 'Organizador']), alertaIAController.deleteAlertaIA);

export default router;
