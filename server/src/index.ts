import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { testConnection, createEventosTable, createUsuariosTable, createEquipesTable, createInscricoesTable, createAvaliacoesTable, createAdminsTable, createAlertasIATable } from './config/db';
import eventoRoutes from './routes/evento.routes';
import usuarioRoutes from './routes/usuario.routes';
import equipeRoutes from './routes/equipe.routes';
import inscricaoRoutes from './routes/inscricao.routes';
import { baseAvaliacaoRouter, eventoAvaliacaoRouter } from './routes/avaliacao.routes';
import adminRoutes from './routes/admin.routes';
import alertaIARoutes from './routes/alertaIA.routes';
import authRoutes from './routes/auth.routes';
import iaRoutes from './routes/ia.routes';

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});
app.use('/api/eventos', eventoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/equipes', equipeRoutes);
app.use('/api/inscricoes', inscricaoRoutes);
app.use('/api/avaliacoes', baseAvaliacaoRouter); // For /api/avaliacoes/:id type routes
app.use('/api/eventos/:eventoId/avaliacoes', eventoAvaliacaoRouter); // For /api/eventos/:eventoId/avaliacoes type routes
app.use('/api/admins', adminRoutes);
app.use('/api/alertas-ia', alertaIARoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ia', iaRoutes);

// Start server
const server = app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await testConnection();
  // await createEventosTable(); // Comentado temporariamente para evitar erro de duplicidade na inicialização
  await createUsuariosTable();
  await createEquipesTable();
  await createInscricoesTable();
  await createAvaliacoesTable();
  await createAdminsTable();
  await createAlertasIATable();
});

import { pool as dbPool } from './config/db'; // Import the named export

export const closeServer = (callback?: () => void) => {
  dbPool.end(() => {
    console.log('PostgreSQL pool has been closed');
    server.close(callback);
  });
};

export { app };
