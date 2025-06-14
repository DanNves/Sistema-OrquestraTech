import { Request, Response, NextFunction } from 'express';
 
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Temporariamente permitindo todas as requisições
  next();
}; 