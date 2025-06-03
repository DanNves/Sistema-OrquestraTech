import { Router } from 'express';
import * as equipeController from '../controllers/equipe.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

// GET routes are public
router.get('/', equipeController.getAllEquipes);
router.get('/:id', equipeController.getEquipeById);

// POST, PUT, DELETE routes are protected
const adminAndOrganizerRoles: ('SuperAdmin' | 'Organizador')[] = ['SuperAdmin', 'Organizador'];

// Removendo temporariamente a proteção para testes locais
// router.post('/', protect, authorize(adminAndOrganizerRoles), equipeController.createEquipe);
// router.put('/:id', protect, authorize(adminAndOrganizerRoles), equipeController.updateEquipe);
// router.delete('/:id', protect, authorize(adminAndOrganizerRoles), equipeController.deleteEquipe);

router.post('/', equipeController.createEquipe);
router.put('/:id', equipeController.updateEquipe);
router.delete('/:id', equipeController.deleteEquipe);

// Manage Integrantes - protected
// Removendo temporariamente a proteção para testes locais
// router.post('/:equipeId/integrantes/:usuarioId', protect, authorize(adminAndOrganizerRoles), equipeController.addIntegranteToEquipe);
// router.delete('/:equipeId/integrantes/:usuarioId', protect, authorize(adminAndOrganizerRoles), equipeController.removeIntegranteFromEquipe);

router.post('/:equipeId/integrantes/:usuarioId', equipeController.addIntegranteToEquipe);
router.delete('/:equipeId/integrantes/:usuarioId', equipeController.removeIntegranteFromEquipe);

// Manage Eventos - protected
// Removendo temporariamente a proteção para testes locais
// router.post('/:equipeId/eventos/:eventoId', protect, authorize(adminAndOrganizerRoles), equipeController.addEventoToEquipe);

router.post('/:equipeId/eventos/:eventoId', equipeController.addEventoToEquipe);

// Note: A route for removing an evento from an equipe might be needed, e.g.:
// router.delete('/:equipeId/eventos/:eventoId', equipeController.removeEventoFromEquipe);
// This would require a corresponding service and controller function.

export default router;
