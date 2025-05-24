import { Usuario } from './usuario.model';

// Admin pode herdar de Usuario ou ter campos específicos
export interface Admin extends Usuario {
  // Campos específicos do Admin, se houver
  // Exemplo: nivelAcesso: number;
}
