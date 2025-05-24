import { Router } from 'express';
import * as usuarioController from '../controllers/usuario.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

// GET routes are public
router.get('/', usuarioController.getAllUsuarios);
router.get('/:id', usuarioController.getUsuarioById);

// POST, PUT, DELETE routes are protected (e.g., require 'Organizador' or 'SuperAdmin')
// Adjust roles as per actual requirements for user management
router.post('/', protect, authorize(['SuperAdmin', 'Organizador']), usuarioController.createUsuario);
router.put('/:id', protect, authorize(['SuperAdmin', 'Organizador']), usuarioController.updateUsuario); // Or allow users to update their own profiles
router.delete('/:id', protect, authorize(['SuperAdmin']), usuarioController.deleteUsuario); // Typically only SuperAdmin or admin can delete users

export default router;
