import { Router } from 'express';
import * as iaController from '../controllers/ia.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Todas as rotas de IA requerem autenticação
router.use(protect);

// Rota para obter todos os alertas
router.get('/alertas', iaController.getAlertas);

// Rota para marcar um alerta como lido
router.put('/alertas/:id/lido', iaController.marcarAlertaComoLido);

// Rota para gerar alertas automáticos (apenas para testes)
router.post('/alertas/gerar', iaController.gerarAlertasAutomaticos);

export default router; 