import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const loginAdminHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    const result = await authService.loginAdmin(email, password);

    if (!result) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    res.status(200).json({ token: result.token, admin: result.admin });
  } catch (error) {
    console.error('Erro no controlador de login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Placeholder for Usuario login handler
// export const usuarioLoginHandler = async (req: Request, res: Response) => {
//   // ... implementation ...
// };
