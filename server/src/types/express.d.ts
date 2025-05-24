import { Admin } from '../models/admin.model';
// import { Usuario } from '../models/usuario.model'; // If/when user auth is added

declare global {
  namespace Express {
    interface Request {
      admin?: Omit<Admin, 'password_hash'>;
      // user?: Usuario;
    }
  }
}
