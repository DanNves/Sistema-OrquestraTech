import { Request, Response } from 'express';
import * as eventoService from '../services/evento.service';
import { Evento } from '../models/evento.model'; // Assuming Evento has all fields including those not in Omit

export const createEvento = async (req: Request, res: Response) => {
  try {
    // Basic validation
    const { nome, data, titulo, horaInicio, horaFim, tipo, status } = req.body;
    if (!nome || !data || !titulo || !horaInicio || !horaFim || !tipo || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newEvento = await eventoService.createEvento(req.body);
    res.status(201).json(newEvento);
  } catch (error) {
    console.error('Error creating evento:', error);
    res.status(500).json({ message: 'Error creating evento', error: (error as Error).message });
  }
};

export const getAllEventos = async (req: Request, res: Response) => {
  try {
    const eventos = await eventoService.getAllEventos();
    res.status(200).json(eventos);
  } catch (error) {
    console.error('Error getting eventos:', error);
    res.status(500).json({ message: 'Error getting eventos', error: (error as Error).message });
  }
};

export const getEventoById = async (req: Request, res: Response) => {
  try {
    const evento = await eventoService.getEventoById(req.params.id);
    if (evento) {
      res.status(200).json(evento);
    } else {
      res.status(404).json({ message: 'Evento not found' });
    }
  } catch (error) {
    console.error('Error getting evento by ID:', error);
    res.status(500).json({ message: 'Error getting evento by ID', error: (error as Error).message });
  }
};

export const updateEvento = async (req: Request, res: Response) => {
  try {
    const evento = await eventoService.updateEvento(req.params.id, req.body);
    if (evento) {
      res.status(200).json(evento);
    } else {
      res.status(404).json({ message: 'Evento not found' });
    }
  } catch (error) {
    console.error('Error updating evento:', error);
    res.status(500).json({ message: 'Error updating evento', error: (error as Error).message });
  }
};

export const deleteEvento = async (req: Request, res: Response) => {
  try {
    const success = await eventoService.deleteEvento(req.params.id);
    if (success) {
      res.status(204).send(); // No content
    } else {
      res.status(404).json({ message: 'Evento not found' });
    }
  } catch (error) {
    console.error('Error deleting evento:', error);
    res.status(500).json({ message: 'Error deleting evento', error: (error as Error).message });
  }
};
