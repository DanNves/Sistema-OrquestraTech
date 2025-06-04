import { Request, Response } from 'express';
import * as eventoService from '../services/evento.service';
import { Evento } from '../models/evento.model'; // Assuming Evento has all fields including those not in Omit

export const createEvento = async (req: Request, res: Response) => {
  try {
    console.log('Recebida requisição para criar novo evento:', req.body);
    const evento = await eventoService.createEvento(req.body);
    console.log('Evento criado com sucesso:', evento);
    res.status(201).json(evento);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ 
      error: 'Erro ao criar evento',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
};

export const getAllEventos = async (req: Request, res: Response) => {
  try {
    console.log('Recebida requisição para buscar todos os eventos');
    const eventos = await eventoService.getAllEventos();
    console.log(`Retornando ${eventos.length} eventos`);
    res.json(eventos);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar eventos',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
};

export const getEventoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`Recebida requisição para buscar evento com ID: ${id}`);
    
    const evento = await eventoService.getEventoById(id);
    if (!evento) {
      console.log(`Evento com ID ${id} não encontrado`);
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    
    console.log(`Evento encontrado: ${evento.nome}`);
    res.json(evento);
  } catch (error) {
    console.error(`Erro ao buscar evento com ID ${req.params.id}:`, error);
    res.status(500).json({ 
      error: 'Erro ao buscar evento',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
};

export const updateEvento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`Recebida requisição para atualizar evento ${id}:`, req.body);
    
    const evento = await eventoService.updateEvento(id, req.body);
    if (!evento) {
      console.log(`Evento com ID ${id} não encontrado para atualização`);
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    
    console.log('Evento atualizado com sucesso:', evento);
    res.json(evento);
  } catch (error) {
    console.error(`Erro ao atualizar evento ${req.params.id}:`, error);
    res.status(500).json({ 
      error: 'Erro ao atualizar evento',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
};

export const deleteEvento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`Recebida requisição para deletar evento ${id}`);
    
    const deleted = await eventoService.deleteEvento(id);
    if (!deleted) {
      console.log(`Evento com ID ${id} não encontrado para deleção`);
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    
    console.log(`Evento ${id} deletado com sucesso`);
    res.status(204).send();
  } catch (error) {
    console.error(`Erro ao deletar evento ${req.params.id}:`, error);
    res.status(500).json({ 
      error: 'Erro ao deletar evento',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
};
