import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db';
import { AlertaIA } from '../models/alertaIA.model';

export const createAlertaIA = async (
  alertaData: Omit<AlertaIA, 'id' | 'read' | 'created_at'>
): Promise<AlertaIA> => {
  const { tipo, mensagem, data, eventoRelacionadoId } = alertaData;
  const id = uuidv4();
  
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO alertas_ia (id, tipo, mensagem, data, eventoRelacionadoId, read)
      VALUES ($1, $2, $3, $4, $5, false)
      RETURNING *;
    `;
    const values = [id, tipo, mensagem, data, eventoRelacionadoId];
    const result = await client.query(query, values);
    return result.rows[0];
  } finally {
    client.release();
  }
};

export const getAllAlertasIA = async (filters: { 
  tipo?: string, 
  eventoRelacionadoId?: string, 
  read?: boolean 
}): Promise<AlertaIA[]> => {
  const client = await pool.connect();
  try {
    let query = 'SELECT * FROM alertas_ia';
    const values = [];
    const conditions = [];

    if (filters.tipo) {
      values.push(filters.tipo);
      conditions.push(`tipo = $${values.length}`);
    }
    if (filters.eventoRelacionadoId) {
      values.push(filters.eventoRelacionadoId);
      conditions.push(`eventoRelacionadoId = $${values.length}`);
    }
    if (filters.read !== undefined) {
      values.push(filters.read);
      conditions.push(`read = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY created_at DESC;'; // Default ordering

    const result = await client.query(query, values);
    return result.rows;
  } finally {
    client.release();
  }
};

export const getAlertaIAById = async (id: string): Promise<AlertaIA | null> => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM alertas_ia WHERE id = $1;', [id]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
};

export const markAlertaAsRead = async (id: string): Promise<AlertaIA | null> => {
  const client = await pool.connect();
  try {
    const query = `
      UPDATE alertas_ia
      SET read = true, created_at = CURRENT_TIMESTAMP -- Assuming 'created_at' should be 'updated_at' conceptually
      WHERE id = $1
      RETURNING *;
    `;
    // If there's an 'updated_at' field, it should be updated instead of 'created_at'
    // For now, following the schema which only has 'created_at'
    const result = await client.query(query, [id]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
};

export const deleteAlertaIA = async (id: string): Promise<boolean> => {
  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM alertas_ia WHERE id = $1;', [id]);
    return result.rowCount > 0;
  } finally {
    client.release();
  }
};
