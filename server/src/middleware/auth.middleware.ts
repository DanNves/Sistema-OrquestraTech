import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as adminService from '../services/admin.service';
import { Admin } from '../models/admin.model'; // Ensure this path is correct
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_jwt_padrao';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & { id: string; cargo: Admin['cargo'] };
      
      // Fetch admin details but without the password hash
      const admin = await adminService.getAdminById(decoded.id);
      if (!admin) {
        return res.status(401).json({ message: 'Not authorized, admin not found' });
      }
      req.admin = admin; // Attach admin to request object (excluding password_hash)
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const authorize = (roles: Admin['cargo'][]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.admin || !req.admin.cargo) {
      return res.status(403).json({ message: 'User role not available for authorization' });
    }
    if (!roles.includes(req.admin.cargo)) {
      return res.status(403).json({
        message: `Admin role '${req.admin.cargo}' is not authorized to access this route. Allowed roles: ${roles.join(', ')}`,
      });
    }
    next();
  };
};
