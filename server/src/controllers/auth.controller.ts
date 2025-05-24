import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const adminLoginHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await authService.loginAdmin(email, password);

    if (!result) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in adminLoginHandler:', error);
    res.status(500).json({ message: 'Login failed', error: (error as Error).message });
  }
};

// Placeholder for Usuario login handler
// export const usuarioLoginHandler = async (req: Request, res: Response) => {
//   // ... implementation ...
// };
