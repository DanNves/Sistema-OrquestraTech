import { Request, Response } from 'express';
import * as equipeService from '../services/equipe.service';

export const createEquipe = async (req: Request, res: Response) => {
  try {
    const { nome, responsavel } = req.body;
    if (!nome) {
      return res.status(400).json({ message: 'Missing required field: nome' });
    }
    const newEquipe = await equipeService.createEquipe({ nome, responsavel });
    res.status(201).json(newEquipe);
  } catch (error) {
    console.error('Error creating equipe:', error);
    res.status(500).json({ message: 'Error creating equipe', error: (error as Error).message });
  }
};

export const getAllEquipes = async (req: Request, res: Response) => {
  try {
    const equipes = await equipeService.getAllEquipes();
    res.status(200).json(equipes);
  } catch (error) {
    console.error('Error getting equipes:', error);
    res.status(500).json({ message: 'Error getting equipes', error: (error as Error).message });
  }
};

export const getEquipeById = async (req: Request, res: Response) => {
  try {
    const equipe = await equipeService.getEquipeById(req.params.id);
    if (equipe) {
      res.status(200).json(equipe);
    } else {
      res.status(404).json({ message: 'Equipe not found' });
    }
  } catch (error) {
    console.error('Error getting equipe by ID:', error);
    res.status(500).json({ message: 'Error getting equipe by ID', error: (error as Error).message });
  }
};

export const updateEquipe = async (req: Request, res: Response) => {
  try {
    const equipe = await equipeService.updateEquipe(req.params.id, req.body);
    if (equipe) {
      res.status(200).json(equipe);
    } else {
      res.status(404).json({ message: 'Equipe not found' });
    }
  } catch (error) {
    console.error('Error updating equipe:', error);
    res.status(500).json({ message: 'Error updating equipe', error: (error as Error).message });
  }
};

export const deleteEquipe = async (req: Request, res: Response) => {
  try {
    const success = await equipeService.deleteEquipe(req.params.id);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Equipe not found' });
    }
  } catch (error) {
    console.error('Error deleting equipe:', error);
    res.status(500).json({ message: 'Error deleting equipe', error: (error as Error).message });
  }
};

export const addIntegranteToEquipe = async (req: Request, res: Response) => {
  try {
    const { equipeId, usuarioId } = req.params;
    if (!usuarioId) {
        return res.status(400).json({ message: 'Missing usuarioId in request body or path' });
    }
    const equipe = await equipeService.addIntegranteToEquipe(equipeId, usuarioId);
    if (equipe) {
      res.status(200).json(equipe);
    } else {
      res.status(404).json({ message: 'Equipe not found' });
    }
  } catch (error) {
    console.error('Error adding integrante to equipe:', error);
    res.status(500).json({ message: 'Error adding integrante to equipe', error: (error as Error).message });
  }
};

export const removeIntegranteFromEquipe = async (req: Request, res: Response) => {
  try {
    const { equipeId, usuarioId } = req.params;
    const equipe = await equipeService.removeIntegranteFromEquipe(equipeId, usuarioId);
    if (equipe) {
      res.status(200).json(equipe);
    } else {
      // If equipe is null, it might be because the equipe was not found, or the user wasn't in the equipe.
      // The service layer could be more specific, but for now, a general message or re-fetch is okay.
      const updatedEquipe = await equipeService.getEquipeById(equipeId);
      if (updatedEquipe) {
        res.status(200).json(updatedEquipe); // Return the equipe state even if user wasn't there
      } else {
        res.status(404).json({ message: 'Equipe not found' });
      }
    }
  } catch (error) {
    console.error('Error removing integrante from equipe:', error);
    res.status(500).json({ message: 'Error removing integrante from equipe', error: (error as Error).message });
  }
};

export const addEventoToEquipe = async (req: Request, res: Response) => {
  try {
    const { equipeId, eventoId } = req.params;
     if (!eventoId) {
        return res.status(400).json({ message: 'Missing eventoId in request body or path' });
    }
    const equipe = await equipeService.addEventoToEquipe(equipeId, eventoId);
    if (equipe) {
      res.status(200).json(equipe);
    } else {
      res.status(404).json({ message: 'Equipe not found' });
    }
  } catch (error) {
    console.error('Error adding evento to equipe:', error);
    res.status(500).json({ message: 'Error adding evento to equipe', error: (error as Error).message });
  }
};
