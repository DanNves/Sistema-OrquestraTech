import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as adminService from './admin.service';
import { Admin } from '../models/admin.model';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_jwt_padrao';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

const signToken = (id: string, cargo: string): string => {
  return jwt.sign({ id, cargo }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const loginAdmin = async (
  email: string,
  password: string
): Promise<{ token: string; admin: Omit<Admin, 'password_hash'> } | null> => {
  try {
    const admin = await adminService.getAdminByEmail(email);

    if (!admin || !admin.password_hash) {
      return null; // Admin not found or password hash is missing
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return null; // Password does not match
    }

    // Admin matched, create JWT
    const token = signToken(admin.id, admin.cargo);

    // Return token and admin details (without password hash)
    const { password_hash, ...adminDetails } = admin;
    return { token, admin: adminDetails };
  } catch (error) {
    console.error('Error in loginAdmin service:', error);
    throw error; // Re-throw to be caught by controller
  }
};

// Placeholder for Usuario login - to be implemented later if Usuario model gets password field
// export const loginUsuario = async (
//   email: string,
//   password: string
// ): Promise<{ token: string; usuario: any } | null> => {
//   // ... implementation similar to loginAdmin ...
//   console.log(email, password); // Placeholder
//   return null;
// };
