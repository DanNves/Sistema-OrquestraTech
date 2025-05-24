import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db';
import { Evento } from '../models/evento.model';

export const createEvento = async (
  eventData: Omit<Evento, 'id' | 'mediaPontuacao' | 'inscricoes'>
): Promise<Evento> => {
  const {
    nome,
    data,
    descricao,
    local,
    equipesParticipantes,
    titulo,
    horaInicio,
    horaFim,
    tipo,
    status,
    participantes,
  } = eventData;
  const id = uuidv4();
  const newEvento: Evento = {
    id,
    nome,
    data,
    descricao,
    local,
    equipesParticipantes,
    titulo,
    horaInicio,
    horaFim,
    tipo,
    status,
    participantes,
    mediaPontuacao: 0, // Default value
    // inscricoes will be handled separately
  };

  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO eventos (
        id, nome, data, descricao, local, equipesParticipantes, 
        titulo, horaInicio, horaFim, tipo, status, participantes, mediaPontuacao
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *;
    `;
    const values = [
      newEvento.id,
      newEvento.nome,
      newEvento.data,
      newEvento.descricao,
      newEvento.local,
      newEvento.equipesParticipantes,
      newEvento.titulo,
      newEvento.horaInicio,
      newEvento.horaFim,
      newEvento.tipo,
      newEvento.status,
      newEvento.participantes,
      newEvento.mediaPontuacao,
    ];
    const result = await client.query(query, values);
    return result.rows[0];
  } finally {
    client.release();
  }
};

export const getAllEventos = async (): Promise<Evento[]> => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM eventos;');
    return result.rows;
  } finally {
    client.release();
  }
};

export const getEventoById = async (id: string): Promise<Evento | null> => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM eventos WHERE id = $1;', [id]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
};

export const updateEvento = async (
  id: string,
  eventData: Partial<Omit<Evento, 'id' | 'inscricoes'>>
): Promise<Evento | null> => {
  const client = await pool.connect();
  try {
    const existingEvento = await getEventoById(id);
    if (!existingEvento) {
      return null;
    }

    const fieldsToUpdate = { ...existingEvento, ...eventData, updated_at: new Date() };
    
    // Filter out id, inscricoes and any fields that are not part of the Evento model or table
    // This is a basic example; a more robust solution might involve a schema or allow-list
    const allowedFields = [
        'nome', 'data', 'descricao', 'local', 'equipesParticipantes', 
        'titulo', 'horaInicio', 'horaFim', 'tipo', 'status', 
        'participantes', 'mediaPontuacao', 'updated_at'
    ];
    
    let setClause = '';
    const values = [];
    let valueCount = 1;

    for (const key in fieldsToUpdate) {
        if (fieldsToUpdate.hasOwnProperty(key) && allowedFields.includes(key) && key !== 'id') {
            setClause += `${key} = $${valueCount}, `;
            values.push(fieldsToUpdate[key as keyof typeof fieldsToUpdate]);
            valueCount++;
        }
    }

    setClause = setClause.slice(0, -2); // Remove trailing comma and space
    values.push(id); // For the WHERE clause

    if (setClause === '') { // No valid fields to update
        return existingEvento; // Or throw an error
    }
    
    const query = `
      UPDATE eventos
      SET ${setClause}
      WHERE id = $${valueCount}
      RETURNING *;
    `;
    const result = await client.query(query, values);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
};

export const deleteEvento = async (id: string): Promise<boolean> => {
  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM eventos WHERE id = $1;', [id]);
    return result.rowCount > 0;
  } finally {
    client.release();
  }
};
