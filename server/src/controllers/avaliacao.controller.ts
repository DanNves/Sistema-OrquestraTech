import { Request, Response } from 'express';
import * as avaliacaoService from '../services/avaliacao.service';

export const createAvaliacao = async (req: Request, res: Response) => {
  try {
    const { eventoId, usuarioId, pontuacao, comentario, data } = req.body;
    if (!eventoId || !usuarioId || pontuacao === undefined || !data) {
      return res.status(400).json({ message: 'Missing required fields: eventoId, usuarioId, pontuacao, data' });
    }
    if (typeof pontuacao !== 'number' || pontuacao < 0 || pontuacao > 10) {
        return res.status(400).json({ message: 'Invalid pontuacao: must be a number between 0 and 10' });
    }

    const newAvaliacao = await avaliacaoService.createAvaliacao(req.body);
    res.status(201).json(newAvaliacao);
  } catch (error) {
    console.error('Error creating avaliacao:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === '23505') { // PostgreSQL unique violation
        return res.status(409).json({ message: 'User has already reviewed this event.', error: error.message });
    }
    res.status(500).json({ message: 'Error creating avaliacao', error: (error as Error).message });
  }
};

export const getAvaliacoesByEventoId = async (req: Request, res: Response) => {
  try {
    const { eventoId } = req.params;
    if (!eventoId) {
        return res.status(400).json({ message: 'Missing eventoId parameter' });
    }
    const avaliacoes = await avaliacaoService.getAvaliacoesByEventoId(eventoId);
    res.status(200).json(avaliacoes);
  } catch (error) {
    console.error('Error getting avaliacoes by eventoId:', error);
    res.status(500).json({ message: 'Error getting avaliacoes by eventoId', error: (error as Error).message });
  }
};

export const getAvaliacaoById = async (req: Request, res: Response) => {
  try {
    const avaliacao = await avaliacaoService.getAvaliacaoById(req.params.id);
    if (avaliacao) {
      res.status(200).json(avaliacao);
    } else {
      res.status(404).json({ message: 'Avaliacao not found' });
    }
  } catch (error) {
    console.error('Error getting avaliacao by ID:', error);
    res.status(500).json({ message: 'Error getting avaliacao by ID', error: (error as Error).message });
  }
};

export const getAveragePontuacaoByEventoId = async (req: Request, res: Response) => {
    try {
      const { eventoId } = req.params;
      if (!eventoId) {
          return res.status(400).json({ message: 'Missing eventoId parameter' });
      }
      const average = await avaliacaoService.getAveragePontuacaoByEventoId(eventoId);
      res.status(200).json({ eventoId, mediaPontuacao: average });
    } catch (error) {
      console.error('Error getting average pontuacao by eventoId:', error);
      res.status(500).json({ message: 'Error getting average pontuacao', error: (error as Error).message });
    }
};

export const updateAvaliacao = async (req: Request, res: Response) => {
  try {
    const { pontuacao, comentario, data } = req.body;
    if (pontuacao !== undefined && (typeof pontuacao !== 'number' || pontuacao < 0 || pontuacao > 10)) {
        return res.status(400).json({ message: 'Invalid pontuacao: must be a number between 0 and 10' });
    }
    // Ensure at least one updatable field is provided, or adjust logic as needed
    if (pontuacao === undefined && comentario === undefined && data === undefined) {
        return res.status(400).json({ message: 'No fields provided for update.' });
    }

    const avaliacao = await avaliacaoService.updateAvaliacao(req.params.id, req.body);
    if (avaliacao) {
      res.status(200).json(avaliacao);
    } else {
      res.status(404).json({ message: 'Avaliacao not found' });
    }
  } catch (error) {
    console.error('Error updating avaliacao:', error);
    res.status(500).json({ message: 'Error updating avaliacao', error: (error as Error).message });
  }
};

export const deleteAvaliacao = async (req: Request, res: Response) => {
  try {
    const success = await avaliacaoService.deleteAvaliacao(req.params.id);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Avaliacao not found' });
    }
  } catch (error) {
    console.error('Error deleting avaliacao:', error);
    res.status(500).json({ message: 'Error deleting avaliacao', error: (error as Error).message });
  }
};
