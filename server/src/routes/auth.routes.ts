import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import * as usuarioService from '../services/usuario.service';
import * as adminService from '../services/admin.service';
import pool from '../config/db';
// import { protect } from '../middleware/auth.middleware'; // Se necessário para rotas futuras

const router = Router();

// Rota temporária para criar admin de teste
router.post('/create-test-admin', async (req, res) => {
  try {
    const testAdmin = await adminService.createAdmin({
      nome: 'Neves Danniel',
      email: 'nevesdanniel021@hotmail.com',
      password: '123456',
      cargo: 'SuperAdmin',
      permissoes: ['all']
    });
    res.json(testAdmin);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar admin de teste', error: (error as Error).message });
  }
});

// Rota temporária para listar admins
router.get('/admins', async (req, res) => {
  try {
    const admins = await adminService.getAllAdmins();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar admins', error: (error as Error).message });
  }
});

// Rota temporária para criar usuário de teste
router.post('/create-test-user', async (req, res) => {
  try {
    const testUser = await usuarioService.createUsuario({
      nome: 'Usuário Teste',
      email: 'teste@teste.com',
      password: '123456',
      tipo: 'Músico',
      genero: 'Masculino',
      idade: 25
    });
    res.json(testUser);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário de teste', error: (error as Error).message });
  }
});

// Rota temporária para listar usuários (apenas para debug)
router.get('/users', async (req, res) => {
  try {
    const users = await usuarioService.getAllUsuarios();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários', error: (error as Error).message });
  }
});

// Rota temporária para verificar admins e senhas
router.get('/check-admins', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT id, nome, email, cargo, password_hash FROM admins;');
    client.release();
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao verificar admins', error: (error as Error).message });
  }
});

// Rota para login de admin
router.post('/admin/login', authController.loginAdminHandler);

// Rota para registro de novo usuário
router.post('/register', authController.registerUser);

// Rota para login de usuário
router.post('/login', authController.loginUser);

// Placeholder for Usuario login route
// router.post('/usuario/login', authController.usuarioLoginHandler);

export default router;
