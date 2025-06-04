import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import * as usuarioService from '../services/usuario.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use uma chave secreta forte e segura aqui!

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

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { nome, email, password, genero, idade, tipo, equipeId, ultimoEvento } = req.body; // Receber password

    // Validação básica
    if (!nome || !email || !password) {
      return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
    }

    // Verificar se o usuário já existe (pelo email)
    // Assumindo que getUsuarioByEmail existe no service ou podemos adaptar getUsuarioById
    // Vamos precisar adicionar uma função para buscar usuário por email no service
    // Por enquanto, vamos prosseguir com a criação e lidar com o erro UNIQUE do banco se ocorrer

    const newUser = await usuarioService.createUsuario({ 
      nome, 
      email, 
      password, // Passar password para o service (que irá hashear)
      genero, 
      idade, 
      tipo, 
      equipeId, 
      ultimoEvento 
    });

    // Não retornar o hash da senha na resposta
    const userResponse = { ...newUser };
    delete (userResponse as any).password_hash; 

    res.status(201).json(userResponse); // 201 Created

  } catch (error) {
    console.error('Error registering user:', error);
    // Tratar erro de email duplicado do banco de dados
    if ((error as any).code === '23505') { // Código de erro UNIQUE violation no PostgreSQL
        return res.status(400).json({ message: 'Email já cadastrado.' });
    }
    res.status(500).json({ message: 'Error registering user', error: (error as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário pelo email
    // Precisaremos de uma nova função no service: getUsuarioByEmail
    const user = await usuarioService.getUsuarioByEmail(email); // TODO: Implementar no service

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' }); // Usar 401 Unauthorized para falha de login
    }

    // Comparar a senha fornecida com o hash armazenado
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gerar Token JWT
    // Incluir informações relevantes no payload do token (mas NÃO informações sensíveis como a senha)
    const token = jwt.sign(
      { id: user.id, email: user.email, tipo: user.tipo }, 
      JWT_SECRET, 
      { expiresIn: '1h' } // Token expira em 1 hora (ajustar conforme necessidade)
    );

    // Retornar o token
    res.status(200).json({ token });

  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Error logging in', error: (error as Error).message });
  }
};

// TODO: Implementar outras funções de autenticação se necessário (ex: redefinir senha, etc.)

// Placeholder for Usuario login handler
// export const usuarioLoginHandler = async (req: Request, res: Response) => {
//   // ... implementation ...
// };
