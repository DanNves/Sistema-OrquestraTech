import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db';
import { Avaliacao } from '../models/avaliacao.model'; // Assuming this model exists
// Import Evento model/service if direct update of Evento.mediaPontuacao is needed
// import { updateEventoMediaPontuacao } from './evento.service'; 

export const createAvaliacao = async (
  avaliacaoData: Omit<Avaliacao, 'id' | 'created_at' | 'updated_at'>
): Promise<Avaliacao> => {
  const { eventoId, usuarioId, pontuacao, comentario, data } = avaliacaoData;
  const id = uuidv4();
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const query = `
      INSERT INTO avaliacoes (id, eventoId, usuarioId, pontuacao, comentario, data)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [id, eventoId, usuarioId, pontuacao, comentario, data];
    const result = await client.query(query, values);
    
    // After creating an avaliacao, update the mediaPontuacao for the evento
    // This could also be done via a database trigger or a separate cron job for performance
    await updateEventoMediaPontuacao(eventoId, client);

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getAvaliacoesByEventoId = async (eventoId: string): Promise<Avaliacao[]> => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM avaliacoes WHERE eventoId = $1;', [eventoId]);
    return result.rows;
  } finally {
    client.release();
  }
};

export const getAvaliacaoById = async (id: string): Promise<Avaliacao | null> => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM avaliacoes WHERE id = $1;', [id]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
};

// This function will be called internally after CUD operations on avaliacoes for a specific evento
export const updateEventoMediaPontuacao = async (eventoId: string, client: any) => {
  // Use the provided client which is part of a transaction
  const avgQuery = `
    UPDATE eventos
    SET mediaPontuacao = (
      SELECT AVG(pontuacao)
      FROM avaliacoes
      WHERE eventoId = $1
    )
    WHERE id = $1;
  `;
  await client.query(avgQuery, [eventoId]);
};


export const getAveragePontuacaoByEventoId = async (eventoId: string): Promise<number> => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT AVG(pontuacao) as avg_pontuacao FROM avaliacoes WHERE eventoId = $1;',
      [eventoId]
    );
    // AVG returns a string, convert to number. If no reviews, result.rows[0].avg_pontuacao will be null.
    return result.rows[0]?.avg_pontuacao ? parseFloat(result.rows[0].avg_pontuacao) : 0;
  } finally {
    client.release();
  }
};

export const updateAvaliacao = async (
  id: string,
  avaliacaoData: Partial<Omit<Avaliacao, 'id' | 'eventoId' | 'usuarioId' | 'created_at' | 'updated_at'>>
): Promise<Avaliacao | null> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existingAvaliacao = await client.query('SELECT * FROM avaliacoes WHERE id = $1 FOR UPDATE;', [id]);
    if (existingAvaliacao.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }
    
    const eventoId = existingAvaliacao.rows[0].eventoid; // Get eventoId from existing record

    const fieldsToUpdate = { ...existingAvaliacao.rows[0], ...avaliacaoData, updated_at: new Date() };
    
    const allowedFields = ['pontuacao', 'comentario', 'data', 'updated_at'];
    let setClause = '';
    const values = [];
    let valueCount = 1;

    for (const key in fieldsToUpdate) {
        if (fieldsToUpdate.hasOwnProperty(key) && allowedFields.includes(key) && key !== 'id' && key !== 'eventoid' && key !== 'usuarioid' && key !== 'created_at') {
            setClause += `${key} = $${valueCount}, `;
            values.push(fieldsToUpdate[key as keyof typeof fieldsToUpdate]);
            valueCount++;
        }
    }

    setClause = setClause.slice(0, -2);
    values.push(id);

    if (setClause === '') {
        await client.query('ROLLBACK');
        return existingAvaliacao.rows[0];
    }
    
    const query = `
      UPDATE avaliacoes
      SET ${setClause}
      WHERE id = $${valueCount}
      RETURNING *;
    `;
    const result = await client.query(query, values);

    await updateEventoMediaPontuacao(eventoId, client);
    await client.query('COMMIT');
    return result.rows[0] || null;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const deleteAvaliacao = async (id: string): Promise<boolean> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Get eventoId before deleting for updating mediaPontuacao
    const avaliacaoToDelete = await client.query('SELECT eventoId FROM avaliacoes WHERE id = $1;', [id]);
    if (avaliacaoToDelete.rows.length === 0) {
      await client.query('ROLLBACK');
      return false; // Avaliacao not found
    }
    const eventoId = avaliacaoToDelete.rows[0].eventoid;

    const result = await client.query('DELETE FROM avaliacoes WHERE id = $1;', [id]);
    
    if (result.rowCount > 0) {
      await updateEventoMediaPontuacao(eventoId, client);
      await client.query('COMMIT');
      return true;
    } else {
      await client.query('ROLLBACK');
      return false;
    }
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
