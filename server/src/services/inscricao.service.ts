import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db';
import { Inscricao } from '../models/inscricao.model';

export const createInscricao = async (
  inscricaoData: Omit<Inscricao, 'id' | 'created_at' | 'updated_at'>
): Promise<Inscricao> => {
  const { usuarioId, eventoId, status, dataInscricao, motivoCancelamento } = inscricaoData;
  const id = uuidv4();
  
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO inscricoes (id, usuarioId, eventoId, status, dataInscricao, motivoCancelamento)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [id, usuarioId, eventoId, status, dataInscricao, motivoCancelamento];
    const result = await client.query(query, values);
    return result.rows[0];
  } finally {
    client.release();
  }
};

export const getAllInscricoes = async (filters: { 
  eventoId?: string, 
  usuarioId?: string, 
  status?: Inscricao['status'] 
}): Promise<Inscricao[]> => {
  const client = await pool.connect();
  try {
    let query = 'SELECT * FROM inscricoes';
    const values = [];
    const conditions = [];

    if (filters.eventoId) {
      values.push(filters.eventoId);
      conditions.push(`eventoId = $${values.length}`);
    }
    if (filters.usuarioId) {
      values.push(filters.usuarioId);
      conditions.push(`usuarioId = $${values.length}`);
    }
    if (filters.status) {
      values.push(filters.status);
      conditions.push(`status = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ';';

    const result = await client.query(query, values);
    return result.rows;
  } finally {
    client.release();
  }
};

export const getInscricaoById = async (id: string): Promise<Inscricao | null> => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM inscricoes WHERE id = $1;', [id]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
};

export const updateInscricaoStatus = async (
  id: string,
  status: Inscricao['status'],
  motivoCancelamento?: string
): Promise<Inscricao | null> => {
  const client = await pool.connect();
  try {
    let query;
    let values;

    if (status === 'Cancelada') {
      query = `
        UPDATE inscricoes
        SET status = $1, motivoCancelamento = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *;
      `;
      values = [status, motivoCancelamento, id];
    } else {
      // For other statuses, clear motivoCancelamento
      query = `
        UPDATE inscricoes
        SET status = $1, motivoCancelamento = NULL, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *;
      `;
      values = [status, id];
    }
    
    const result = await client.query(query, values);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
};

export const deleteInscricao = async (id: string): Promise<boolean> => {
  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM inscricoes WHERE id = $1;', [id]);
    return result.rowCount > 0;
  } finally {
    client.release();
  }
};
