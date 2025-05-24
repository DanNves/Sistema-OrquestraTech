import { Request, Response } from 'express';
import * as usuarioService from '../services/usuario.service';

export const createUsuario = async (req: Request, res: Response) => {
  try {
    // Basic validation
    const { nome, email, tipo } = req.body;
    if (!nome || !email || !tipo ) {
      return res.status(400).json({ message: 'Missing required fields: nome, email, tipo are required' });
    }
    // Add more specific validation as needed (e.g., email format, tipo values)

    const newUsuario = await usuarioService.createUsuario(req.body);
    res.status(201).json(newUsuario);
  } catch (error) {
    console.error('Error creating usuario:', error);
    // Check for unique constraint violation (e.g., email already exists)
    if (error instanceof Error && 'code' in error && (error as any).code === '23505') { // PostgreSQL unique violation
        return res.status(409).json({ message: 'Email already exists', error: error.message });
    }
    res.status(500).json({ message: 'Error creating usuario', error: (error as Error).message });
  }
};

export const getAllUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await usuarioService.getAllUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Error getting usuarios:', error);
    res.status(500).json({ message: 'Error getting usuarios', error: (error as Error).message });
  }
};

export const getUsuarioById = async (req: Request, res: Response) => {
  try {
    const usuario = await usuarioService.getUsuarioById(req.params.id);
    if (usuario) {
      res.status(200).json(usuario);
    } else {
      res.status(404).json({ message: 'Usuario not found or not active' });
    }
  } catch (error) {
    console.error('Error getting usuario by ID:', error);
    res.status(500).json({ message: 'Error getting usuario by ID', error: (error as Error).message });
  }
};

export const updateUsuario = async (req: Request, res: Response) => {
  try {
    const usuario = await usuarioService.updateUsuario(req.params.id, req.body);
    if (usuario) {
      res.status(200).json(usuario);
    } else {
      res.status(404).json({ message: 'Usuario not found or not active' });
    }
  } catch (error) {
    console.error('Error updating usuario:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === '23505') { // PostgreSQL unique violation for email
        return res.status(409).json({ message: 'Email already exists for another user', error: error.message });
    }
    res.status(500).json({ message: 'Error updating usuario', error: (error as Error).message });
  }
};

export const deleteUsuario = async (req: Request, res: Response) => {
  try {
    const success = await usuarioService.deleteUsuario(req.params.id);
    if (success) {
      res.status(204).send(); // No content, successful soft delete
    } else {
      res.status(404).json({ message: 'Usuario not found or already inactive' });
    }
  } catch (error) {
    console.error('Error deleting usuario:', error);
    res.status(500).json({ message: 'Error deleting usuario', error: (error as Error).message });
  }
};
