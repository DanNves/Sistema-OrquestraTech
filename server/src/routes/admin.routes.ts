import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

// Secure all admin routes
router.post('/', protect, authorize(['SuperAdmin', 'Organizador']), adminController.createAdmin);
router.get('/', protect, authorize(['SuperAdmin', 'Organizador', 'Moderador']), adminController.getAllAdmins);
router.get('/:id', protect, authorize(['SuperAdmin', 'Organizador', 'Moderador']), adminController.getAdminById);
router.put('/:id', protect, authorize(['SuperAdmin']), adminController.updateAdmin); // Only SuperAdmin can update other admins
router.delete('/:id', protect, authorize(['SuperAdmin']), adminController.deleteAdmin);

// Example: Route for login, if you implement the loginAdmin controller function
// router.post('/login', adminController.loginAdmin);

export default router;
