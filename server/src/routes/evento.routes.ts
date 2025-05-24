import { Router } from 'express';
import * as eventoController from '../controllers/evento.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

// GET routes are public
router.get('/', eventoController.getAllEventos);
router.get('/:id', eventoController.getEventoById);

// POST, PUT, DELETE routes are protected and require 'Organizador' or 'SuperAdmin'
router.post('/', protect, authorize(['SuperAdmin', 'Organizador']), eventoController.createEvento);
router.put('/:id', protect, authorize(['SuperAdmin', 'Organizador']), eventoController.updateEvento);
router.delete('/:id', protect, authorize(['SuperAdmin', 'Organizador']), eventoController.deleteEvento);

export default router;
