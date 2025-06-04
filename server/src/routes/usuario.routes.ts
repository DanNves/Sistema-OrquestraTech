import { Router } from 'express';
import * as usuarioController from '../controllers/usuario.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

// GET routes are public
router.get('/', usuarioController.getAllUsuarios);
router.get('/:id', usuarioController.getUsuarioById);

// POST, PUT, DELETE routes are protected (e.g., require 'Organizador' or 'SuperAdmin')
// A rota POST / para criação de usuário NÃO deve ser protegida, pois é para registro inicial.
router.post('/', usuarioController.createUsuario);
router.put('/:id', usuarioController.updateUsuario); // Or allow users to update their own profiles
router.delete('/:id', usuarioController.deleteUsuario); // Typically only SuperAdmin or admin can delete users

// New route for hard deleting a user (permanent deletion)
router.delete('/:id/hard-delete', usuarioController.hardDeleteUsuario);

export default router;
