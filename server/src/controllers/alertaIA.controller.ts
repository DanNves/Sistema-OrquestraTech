import { Request, Response } from 'express';
import * as alertaIAService from '../services/alertaIA.service';
import { AlertaIA } from '../models/alertaIA.model'; // Import the model

export const createAlertaIA = async (req: Request, res: Response) => {
  try {
    const { tipo, mensagem, data, eventoRelacionadoId } = req.body;
    if (!tipo || !mensagem || !data) {
      return res.status(400).json({ message: 'Missing required fields: tipo, mensagem, data' });
    }
    if (!['Ausência', 'Baixa Pontuação', 'Inscrição Baixa', 'Sugestão'].includes(tipo)) {
        return res.status(400).json({ message: 'Invalid tipo value' });
    }

    const newAlerta = await alertaIAService.createAlertaIA(req.body);
    res.status(201).json(newAlerta);
  } catch (error) {
    console.error('Error creating alertaIA:', error);
    res.status(500).json({ message: 'Error creating alertaIA', error: (error as Error).message });
  }
};

export const getAllAlertasIA = async (req: Request, res: Response) => {
  try {
    const { tipo, eventoRelacionadoId, read } = req.query;
    
    const filters: { tipo?: string, eventoRelacionadoId?: string, read?: boolean } = {};
    if (tipo) {
        if (!['Ausência', 'Baixa Pontuação', 'Inscrição Baixa', 'Sugestão'].includes(String(tipo))) {
            return res.status(400).json({ message: 'Invalid tipo filter value' });
        }
        filters.tipo = String(tipo);
    }
    if (eventoRelacionadoId) filters.eventoRelacionadoId = String(eventoRelacionadoId);
    if (read !== undefined) {
        if (String(read) !== 'true' && String(read) !== 'false') {
            return res.status(400).json({ message: 'Invalid read filter value, must be true or false' });
        }
        filters.read = String(read) === 'true';
    }

    const alertas = await alertaIAService.getAllAlertasIA(filters);
    res.status(200).json(alertas);
  } catch (error) {
    console.error('Error getting alertasIA:', error);
    res.status(500).json({ message: 'Error getting alertasIA', error: (error as Error).message });
  }
};

export const getAlertaIAById = async (req: Request, res: Response) => {
  try {
    const alerta = await alertaIAService.getAlertaIAById(req.params.id);
    if (alerta) {
      res.status(200).json(alerta);
    } else {
      res.status(404).json({ message: 'AlertaIA not found' });
    }
  } catch (error) {
    console.error('Error getting alertaIA by ID:', error);
    res.status(500).json({ message: 'Error getting alertaIA by ID', error: (error as Error).message });
  }
};

export const markAlertaAsRead = async (req: Request, res: Response) => {
  try {
    const alerta = await alertaIAService.markAlertaAsRead(req.params.id);
    if (alerta) {
      res.status(200).json(alerta);
    } else {
      res.status(404).json({ message: 'AlertaIA not found' });
    }
  } catch (error) {
    console.error('Error marking alertaIA as read:', error);
    res.status(500).json({ message: 'Error marking alertaIA as read', error: (error as Error).message });
  }
};

export const deleteAlertaIA = async (req: Request, res: Response) => {
  try {
    const success = await alertaIAService.deleteAlertaIA(req.params.id);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'AlertaIA not found' });
    }
  } catch (error) {
    console.error('Error deleting alertaIA:', error);
    res.status(500).json({ message: 'Error deleting alertaIA', error: (error as Error).message });
  }
};

export const gerarAlertasTeste = async (req: Request, res: Response) => {
  try {
    const alertasTeste = [
      {
        tipo: 'Ausência',
        mensagem: 'Equipe XYZ não compareceu ao último evento',
        data: new Date(),
        eventoRelacionadoId: null
      },
      {
        tipo: 'Baixa Pontuação',
        mensagem: 'Equipe ABC teve pontuação abaixo da média no último evento',
        data: new Date(),
        eventoRelacionadoId: null
      },
      {
        tipo: 'Inscrição Baixa',
        mensagem: 'Evento de Robótica tem poucas inscrições',
        data: new Date(),
        eventoRelacionadoId: null
      },
      {
        tipo: 'Sugestão',
        mensagem: 'Considere realizar mais eventos de programação',
        data: new Date(),
        eventoRelacionadoId: null
      }
    ];

    const alertasCriados = await Promise.all(
      alertasTeste.map(alerta => alertaIAService.createAlertaIA(alerta))
    );

    res.status(201).json(alertasCriados);
  } catch (error) {
    console.error('Error generating test alerts:', error);
    res.status(500).json({ message: 'Error generating test alerts', error: (error as Error).message });
  }
};

export const limparAlertas = async (req: Request, res: Response) => {
  try {
    await alertaIAService.limparAlertasTeste();
    res.status(200).json({ message: 'Todos os alertas foram removidos com sucesso' });
  } catch (error) {
    console.error('Error clearing alerts:', error);
    res.status(500).json({ message: 'Error clearing alerts', error: (error as Error).message });
  }
};
