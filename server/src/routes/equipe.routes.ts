import { Router } from 'express';
import * as equipeController from '../controllers/equipe.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

// GET routes are public
router.get('/', equipeController.getAllEquipes);
router.get('/:id', equipeController.getEquipeById);

// POST, PUT, DELETE routes are protected
const adminAndOrganizerRoles: ('SuperAdmin' | 'Organizador')[] = ['SuperAdmin', 'Organizador'];

router.post('/', protect, authorize(adminAndOrganizerRoles), equipeController.createEquipe);
router.put('/:id', protect, authorize(adminAndOrganizerRoles), equipeController.updateEquipe);
router.delete('/:id', protect, authorize(adminAndOrganizerRoles), equipeController.deleteEquipe);

// Manage Integrantes - protected
router.post('/:equipeId/integrantes/:usuarioId', protect, authorize(adminAndOrganizerRoles), equipeController.addIntegranteToEquipe);
router.delete('/:equipeId/integrantes/:usuarioId', protect, authorize(adminAndOrganizerRoles), equipeController.removeIntegranteFromEquipe);

// Manage Eventos - protected
router.post('/:equipeId/eventos/:eventoId', protect, authorize(adminAndOrganizerRoles), equipeController.addEventoToEquipe);
// Note: A route for removing an evento from an equipe might be needed, e.g.:
// router.delete('/:equipeId/eventos/:eventoId', equipeController.removeEventoFromEquipe);
// This would require a corresponding service and controller function.

export default router;
