import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('Database connected successfully:', result.rows[0]);
    client.release();
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

export const createAlertasIATable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS alertas_ia (
        id TEXT PRIMARY KEY,
        tipo TEXT NOT NULL CHECK (tipo IN ('Ausência', 'Baixa Pontuação', 'Inscrição Baixa', 'Sugestão')),
        mensagem TEXT NOT NULL,
        data TIMESTAMP NOT NULL,
        eventoRelacionadoId TEXT, 
        read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('AlertasIA table created successfully or already exists.');
  } catch (error) {
    console.error('Error creating alertas_ia table:', error);
  } finally {
    client.release();
  }
};

export const createAdminsTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id TEXT PRIMARY KEY,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        cargo TEXT CHECK (cargo IN ('SuperAdmin', 'Organizador', 'Moderador')),
        permissoes TEXT[],
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Admins table created successfully or already exists.');
  } catch (error) {
    console.error('Error creating admins table:', error);
  } finally {
    client.release();
  }
};

export const createAvaliacoesTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS avaliacoes (
        id TEXT PRIMARY KEY,
        eventoId TEXT NOT NULL,
        usuarioId TEXT NOT NULL, -- Assuming this is the ID of the user who made the review
        pontuacao INTEGER NOT NULL CHECK (pontuacao >= 0 AND pontuacao <= 10),
        comentario TEXT,
        data TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (eventoId, usuarioId) -- One review per user per event
      );
    `);
    console.log('Avaliacoes table created successfully or already exists.');
  } catch (error) {
    console.error('Error creating avaliacoes table:', error);
  } finally {
    client.release();
  }
};

export const createInscricoesTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS inscricoes (
        id TEXT PRIMARY KEY,
        usuarioId TEXT NOT NULL,
        eventoId TEXT NOT NULL,
        status TEXT CHECK (status IN ('Confirmada', 'Pendente', 'Cancelada')) NOT NULL,
        dataInscricao TIMESTAMP NOT NULL,
        motivoCancelamento TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (usuarioId, eventoId)
      );
    `);
    console.log('Inscricoes table created successfully or already exists.');
  } catch (error) {
    console.error('Error creating inscricoes table:', error);
  } finally {
    client.release();
  }
};

export const createEquipesTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS equipes (
        id TEXT PRIMARY KEY,
        nome TEXT NOT NULL,
        integrantes TEXT[], -- Array of Usuario IDs
        eventos TEXT[], -- Array of Evento IDs
        mediaPontuacao REAL DEFAULT 0,
        presencaMedia REAL DEFAULT 0, -- Percentage
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Equipes table created successfully or already exists.');
  } catch (error) {
    console.error('Error creating equipes table:', error);
  } finally {
    client.release();
  }
};

export const createUsuariosTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id TEXT PRIMARY KEY,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        genero TEXT CHECK (genero IN ('Masculino', 'Feminino', 'Outro', 'Prefere não dizer')),
        idade INTEGER,
        tipo TEXT CHECK (tipo IN ('Músico', 'Técnico', 'Organizador')),
        eventosParticipou TEXT[],
        score REAL DEFAULT 0,
        equipeId TEXT,
        ultimoEvento TEXT,
        ativo BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Usuarios table created successfully or already exists.');
  } catch (error) {
    console.error('Error creating usuarios table:', error);
  } finally {
    client.release();
  }
};

export const createEventosTable = async () => {
  const client = await pool.connect();
  try {
    // Primeiro, dropar a tabela existente
    await client.query(`DROP TABLE IF EXISTS eventos CASCADE;`);
    
    // Depois, criar a tabela com a nova estrutura
    await client.query(`
      CREATE TABLE eventos (
        id TEXT PRIMARY KEY,
        nome TEXT NOT NULL,
        data DATE NOT NULL,
        descricao TEXT,
        local TEXT,
        equipesParticipantes TEXT[],
        titulo TEXT NOT NULL,
        horaInicio TIME NOT NULL,
        horaFim TIME NOT NULL,
        tipo TEXT CHECK (tipo IN ('Ensaio de Seção', 'Ensaio Geral', 'Encontro Técnico')),
        status TEXT CHECK (status IN ('Programado', 'Em Andamento', 'Concluído', 'Cancelado')),
        participantes TEXT[],
        mediaPontuacao REAL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Eventos table created successfully with new structure.');
  } catch (error) {
    console.error('Error creating eventos table:', error);
  } finally {
    client.release();
  }
};

export { pool }; // Export pool for graceful shutdown
export default pool; // Keep default export for existing services
