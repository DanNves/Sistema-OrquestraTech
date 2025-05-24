import { Router } from 'express';
import * as avaliacaoController from '../controllers/avaliacao.controller';

const router = Router({ mergeParams: true }); // mergeParams allows access to :eventoId from a parent router

// POST /api/avaliacoes (if not nested under /eventos)
// Or POST /api/eventos/:eventoId/avaliacoes (if nested)
router.post('/', avaliacaoController.createAvaliacao);

// GET /api/eventos/:eventoId/avaliacoes
// This route makes more sense if this router is mounted under /api/eventos/:eventoId
router.get('/', avaliacaoController.getAvaliacoesByEventoId);

// GET /api/eventos/:eventoId/avaliacoes/media (custom route for average)
router.get('/media', avaliacaoController.getAveragePontuacaoByEventoId);


// Routes for specific avaliacao by its ID
// These would typically be mounted under /api/avaliacoes
const singleAvaliacaoRouter = Router();
singleAvaliacaoRouter.get('/:id', avaliacaoController.getAvaliacaoById);
singleAvaliacaoRouter.put('/:id', avaliacaoController.updateAvaliacao);
singleAvaliacaoRouter.delete('/:id', avaliacaoController.deleteAvaliacao);

// It's generally better to have a clear prefix for all avaliacao specific routes
// So, instead of mixing, we'll export the base router for /eventos/:eventoId/avaliacoes
// and a separate one for /avaliacoes/:id operations if needed, or combine them carefully.

// For this subtask, let's assume:
// - POST to /api/avaliacoes (needs eventoId in body)
// - GET to /api/eventos/:eventoId/avaliacoes (gets all for an event)
// - GET to /api/eventos/:eventoId/avaliacoes/media (gets average for an event)
// - GET, PUT, DELETE to /api/avaliacoes/:id (for specific avaliacao)

// We'll need two router instances or careful route definition.
// Let's create a primary router for /api/avaliacoes
import { protect, authorize } from '../middleware/auth.middleware';

const baseAvaliacaoRouter = Router();
// Assuming creating/updating/deleting reviews requires a logged-in user (any role for now)
// More specific roles can be added if needed (e.g. only 'Participante' can create)
// For now, let's use a general protection.
// Or, if only admins should manage reviews directly: authorize(['SuperAdmin', 'Organizador'])
baseAvaliacaoRouter.post('/', protect, avaliacaoController.createAvaliacao); // Any authenticated user can create
baseAvaliacaoRouter.get('/:id', avaliacaoController.getAvaliacaoById); // Public GET for specific review
baseAvaliacaoRouter.put('/:id', protect, avaliacaoController.updateAvaliacao); // User might only update their own, or admin only
baseAvaliacaoRouter.delete('/:id', protect, authorize(['SuperAdmin', 'Organizador']), avaliacaoController.deleteAvaliacao); // Only admins can delete


// And a specific router for routes related to an evento
const eventoAvaliacaoRouter = Router({ mergeParams: true });
eventoAvaliacaoRouter.get('/', avaliacaoController.getAvaliacoesByEventoId);
eventoAvaliacaoRouter.get('/media', avaliacaoController.getAveragePontuacaoByEventoId);
// A POST to /api/eventos/:eventoId/avaliacoes could also be defined here
// if we want to enforce eventoId from the path param for creation.
// For now, createAvaliacao expects eventoId in the body.


export { baseAvaliacaoRouter, eventoAvaliacaoRouter };
