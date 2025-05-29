import { Usuario } from './usuario.model';

// Admin pode herdar de Usuario ou ter campos específicos
export interface Admin {
  id: string;
  nome: string;
  email: string;
  cargo: 'SuperAdmin' | 'Organizador' | 'Moderador';
  permissoes: string[];
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}
