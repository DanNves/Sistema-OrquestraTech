import { Request, Response } from 'express';
import * as inscricaoService from '../services/inscricao.service';
import { Inscricao } from '../models/inscricao.model'; // Import the model

export const createInscricao = async (req: Request, res: Response) => {
  try {
    const { usuarioId, eventoId, status, dataInscricao } = req.body;
    if (!usuarioId || !eventoId || !status || !dataInscricao) {
      return res.status(400).json({ message: 'Missing required fields: usuarioId, eventoId, status, dataInscricao' });
    }
    // Basic validation for status
    if (!['Confirmada', 'Pendente', 'Cancelada'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    const newInscricao = await inscricaoService.createInscricao(req.body);
    res.status(201).json(newInscricao);
  } catch (error) {
    console.error('Error creating inscricao:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === '23505') { // PostgreSQL unique violation
        return res.status(409).json({ message: 'Duplicate inscricao: Usuario already registered for this evento.', error: error.message });
    }
    res.status(500).json({ message: 'Error creating inscricao', error: (error as Error).message });
  }
};

export const getAllInscricoes = async (req: Request, res: Response) => {
  try {
    const { eventoId, usuarioId, status } = req.query;
    
    const filters: { eventoId?: string, usuarioId?: string, status?: Inscricao['status'] } = {};
    if (eventoId) filters.eventoId = String(eventoId);
    if (usuarioId) filters.usuarioId = String(usuarioId);
    if (status) {
        if (!['Confirmada', 'Pendente', 'Cancelada'].includes(String(status))) {
            return res.status(400).json({ message: 'Invalid status filter value' });
        }
        filters.status = String(status) as Inscricao['status'];
    }

    const inscricoes = await inscricaoService.getAllInscricoes(filters);
    res.status(200).json(inscricoes);
  } catch (error) {
    console.error('Error getting inscricoes:', error);
    res.status(500).json({ message: 'Error getting inscricoes', error: (error as Error).message });
  }
};

export const getInscricaoById = async (req: Request, res: Response) => {
  try {
    const inscricao = await inscricaoService.getInscricaoById(req.params.id);
    if (inscricao) {
      res.status(200).json(inscricao);
    } else {
      res.status(404).json({ message: 'Inscricao not found' });
    }
  } catch (error) {
    console.error('Error getting inscricao by ID:', error);
    res.status(500).json({ message: 'Error getting inscricao by ID', error: (error as Error).message });
  }
};

export const updateInscricaoStatus = async (req: Request, res: Response) => {
  try {
    const { status, motivoCancelamento } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Missing required field: status' });
    }
    if (!['Confirmada', 'Pendente', 'Cancelada'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }
    if (status === 'Cancelada' && !motivoCancelamento) {
        // return res.status(400).json({ message: 'motivoCancelamento is required when status is Cancelada' });
        // Allowing cancellation without motivo for now, can be made strict if needed
    }

    const inscricao = await inscricaoService.updateInscricaoStatus(req.params.id, status, motivoCancelamento);
    if (inscricao) {
      res.status(200).json(inscricao);
    } else {
      res.status(404).json({ message: 'Inscricao not found' });
    }
  } catch (error) {
    console.error('Error updating inscricao status:', error);
    res.status(500).json({ message: 'Error updating inscricao status', error: (error as Error).message });
  }
};

export const deleteInscricao = async (req: Request, res: Response) => {
  try {
    const success = await inscricaoService.deleteInscricao(req.params.id);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Inscricao not found' });
    }
  } catch (error) {
    console.error('Error deleting inscricao:', error);
    res.status(500).json({ message: 'Error deleting inscricao', error: (error as Error).message });
  }
};
