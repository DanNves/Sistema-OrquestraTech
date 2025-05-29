import { Router, Request, Response, NextFunction } from 'express';
import { getAllEventos, getEventoById, createEvento, updateEvento, deleteEvento } from '../services/evento.service';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

// GET routes are public
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const eventos = await getAllEventos();
    res.json(eventos);
  } catch (error) {
    // TODO: Implementar tratamento de erro mais robusto
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Erro ao buscar eventos.' });
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const evento = await getEventoById(id);
    if (evento) {
      res.json(evento);
    } else {
      res.status(404).json({ message: 'Evento não encontrado.' });
    }
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    res.status(500).json({ message: 'Erro ao buscar evento.' });
  }
});

// POST, PUT, DELETE routes are protected and require 'Organizador' or 'SuperAdmin'
router.post('/', protect, authorize(['SuperAdmin', 'Organizador']), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log('Requisição POST /api/eventos recebida.');
  try {
    const eventoData = req.body; // Assume que os dados do evento vêm no corpo da requisição
    const novoEvento = await createEvento(eventoData);
    res.status(201).json(novoEvento);
  } catch (error: any) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ message: error.message || 'Erro interno do servidor' });
  }
});

router.put('/:id', protect, authorize(['SuperAdmin', 'Organizador']), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const eventoData = req.body; // Assume que os dados atualizados vêm no corpo da requisição
    const eventoAtualizado = await updateEvento(id, eventoData);
    if (eventoAtualizado) {
      res.json(eventoAtualizado);
    } else {
      res.status(404).json({ message: 'Evento não encontrado para atualização.' });
    }
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Erro ao atualizar evento.' });
  }
});

router.delete('/:id', protect, authorize(['SuperAdmin', 'Organizador']), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const sucesso = await deleteEvento(id);
    if (sucesso) {
      res.status(200).json({ message: 'Evento excluído com sucesso.' });
    } else {
      res.status(404).json({ message: 'Evento não encontrado para exclusão.' });
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Erro ao excluir evento.' });
  }
});

export default router;
