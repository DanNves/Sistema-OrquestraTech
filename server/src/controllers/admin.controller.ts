import { Request, Response } from 'express';
import * as adminService from '../services/admin.service';
import bcrypt from 'bcrypt'; // For comparing passwords in a login route, if added later

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { nome, email, cargo, password } = req.body;
    if (!nome || !email || !cargo || !password) {
      return res.status(400).json({ message: 'Missing required fields: nome, email, cargo, password' });
    }
    if (!['SuperAdmin', 'Organizador', 'Moderador'].includes(cargo)) {
        return res.status(400).json({ message: 'Invalid cargo value' });
    }
    // Add more validation as needed (e.g., password strength)

    const newAdmin = await adminService.createAdmin(req.body);
    res.status(201).json(newAdmin);
  } catch (error) {
    console.error('Error creating admin:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === '23505') { // PostgreSQL unique violation for email
        return res.status(409).json({ message: 'Email already exists', error: error.message });
    }
    res.status(500).json({ message: 'Error creating admin', error: (error as Error).message });
  }
};

export const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await adminService.getAllAdmins();
    res.status(200).json(admins);
  } catch (error) {
    console.error('Error getting admins:', error);
    res.status(500).json({ message: 'Error getting admins', error: (error as Error).message });
  }
};

export const getAdminById = async (req: Request, res: Response) => {
  try {
    const admin = await adminService.getAdminById(req.params.id);
    if (admin) {
      res.status(200).json(admin);
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    console.error('Error getting admin by ID:', error);
    res.status(500).json({ message: 'Error getting admin by ID', error: (error as Error).message });
  }
};

// Example: Login route - not part of CRUD but uses getAdminByEmail
// export const loginAdmin = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }
//     const admin = await adminService.getAdminByEmail(email);
//     if (!admin) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
//     const isMatch = await bcrypt.compare(password, admin.password_hash);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
//     // Here you would typically generate a JWT token and send it back
//     // For now, just return admin data (without password_hash)
//     const { password_hash, ...adminData } = admin;
//     res.status(200).json({ message: 'Login successful', admin: adminData /*, token: 'your_jwt_token' */ });
//   } catch (error) {
//     console.error('Error logging in admin:', error);
//     res.status(500).json({ message: 'Error logging in admin', error: (error as Error).message });
//   }
// };

export const updateAdmin = async (req: Request, res: Response) => {
  try {
    const { cargo } = req.body;
    if (cargo && !['SuperAdmin', 'Organizador', 'Moderador'].includes(cargo)) {
        return res.status(400).json({ message: 'Invalid cargo value' });
    }

    const admin = await adminService.updateAdmin(req.params.id, req.body);
    if (admin) {
      res.status(200).json(admin);
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    console.error('Error updating admin:', error);
     if (error instanceof Error && 'code' in error && (error as any).code === '23505') { // PostgreSQL unique violation for email
        return res.status(409).json({ message: 'Email already exists for another admin', error: error.message });
    }
    res.status(500).json({ message: 'Error updating admin', error: (error as Error).message });
  }
};

export const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const success = await adminService.deleteAdmin(req.params.id);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ message: 'Error deleting admin', error: (error as Error).message });
  }
};
