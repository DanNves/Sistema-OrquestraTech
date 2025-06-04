import { Router } from 'express';
import * as eventoController from '../controllers/evento.controller';
import { authenticateToken } from '../middleware/auth';
import { validateEvento } from '../middleware/validation';

const router = Router();

// Middleware de autenticação para todas as rotas
router.use(authenticateToken);

// Rota para buscar todos os eventos
router.get('/', eventoController.getAllEventos);

// Rota para buscar um evento específico
router.get('/:id', eventoController.getEventoById);

// Rota para criar um novo evento
router.post('/', validateEvento, eventoController.createEvento);

// Rota para atualizar um evento existente
router.put('/:id', validateEvento, eventoController.updateEvento);

// Rota para deletar um evento
router.delete('/:id', eventoController.deleteEvento);

export default router;
