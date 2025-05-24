import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

router.post('/admin/login', authController.adminLoginHandler);

// Placeholder for Usuario login route
// router.post('/usuario/login', authController.usuarioLoginHandler);

export default router;
