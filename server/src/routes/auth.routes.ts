import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
// import { protect } from '../middleware/auth.middleware'; // Se necessário para rotas futuras

const router = Router();

// Rota de login para administradores/organizadores
router.post('/login', authController.loginAdminHandler);

// Placeholder for Usuario login route
// router.post('/usuario/login', authController.usuarioLoginHandler);

export default router;
