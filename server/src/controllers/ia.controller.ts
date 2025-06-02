import { Request, Response } from 'express';
import * as iaService from '../services/ia.service';

export const getAlertas = async (req: Request, res: Response) => {
  try {
    const alertas = await iaService.getAlertasIA();
    res.json(alertas);
  } catch (error) {
    console.error('Erro ao buscar alertas:', error);
    res.status(500).json({ error: 'Erro ao buscar alertas' });
  }
};

export const marcarAlertaComoLido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const alerta = await iaService.marcarAlertaComoLido(id);
    if (!alerta) {
      return res.status(404).json({ error: 'Alerta não encontrado' });
    }
    res.json(alerta);
  } catch (error) {
    console.error('Erro ao marcar alerta como lido:', error);
    res.status(500).json({ error: 'Erro ao marcar alerta como lido' });
  }
};

export const gerarAlertasAutomaticos = async (req: Request, res: Response) => {
  try {
    await iaService.gerarAlertasAutomaticos();
    res.json({ message: 'Alertas gerados com sucesso' });
  } catch (error) {
    console.error('Erro ao gerar alertas automáticos:', error);
    res.status(500).json({ error: 'Erro ao gerar alertas automáticos' });
  }
}; 