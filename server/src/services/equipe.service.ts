import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db';
import { Equipe } from '../models/equipe.model';

export const createEquipe = async (
  equipeData: Omit<Equipe, 'id' | 'mediaPontuacao' | 'presencaMedia' | 'eventos' | 'integrantes'> & { nome: string; responsavel?: string }
): Promise<Equipe> => {
  const { nome, responsavel } = equipeData;
  const id = uuidv4();
  const newEquipe: Equipe = {
    id,
    nome,
    responsavel: responsavel || null, // Use null if responsavel is undefined
    integrantes: [], // Default empty array
    eventos: [], // Default empty array
    mediaPontuacao: 0, // Default value
    presencaMedia: 0, // Default value
    // created_at and updated_at will be handled by the database
  };

  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO equipes (id, nome, responsavel, integrantes, eventos, mediaPontuacao, presencaMedia)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [
      newEquipe.id,
      newEquipe.nome,
      newEquipe.responsavel,
      newEquipe.integrantes,
      newEquipe.eventos,
      newEquipe.mediaPontuacao,
      newEquipe.presencaMedia,
    ];
    const result = await client.query(query, values);
    return result.rows[0];
  } finally {
    client.release();
  }
};

export const getAllEquipes = async (): Promise<Equipe[]> => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM equipes;');
    return result.rows;
  } finally {
    client.release();
  }
};

export const getEquipeById = async (id: string): Promise<Equipe | null> => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM equipes WHERE id = $1;', [id]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
};

export const updateEquipe = async (
  id: string,
  equipeData: Partial<Omit<Equipe, 'id'>>
): Promise<Equipe | null> => {
  const client = await pool.connect();
  try {
    const existingEquipe = await getEquipeById(id);
    if (!existingEquipe) {
      return null;
    }

    const fieldsToUpdate = { ...existingEquipe, ...equipeData, updated_at: new Date() };
    
    const allowedFields = [
        'nome', 'responsavel', 'integrantes', 'eventos', 'mediaPontuacao', 
        'presencaMedia', 'updated_at'
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

    setClause = setClause.slice(0, -2);
    values.push(id);

    if (setClause === '') {
        return existingEquipe;
    }
    
    const query = `
      UPDATE equipes
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

export const deleteEquipe = async (id: string): Promise<boolean> => {
  const client = await pool.connect();
  try {
    // Consider implications: what happens to Usuarios in this equipe?
    // For now, just deletes the equipe.
    const result = await client.query('DELETE FROM equipes WHERE id = $1;', [id]);
    return result.rowCount > 0;
  } finally {
    client.release();
  }
};

export const addIntegranteToEquipe = async (equipeId: string, usuarioId: string): Promise<Equipe | null> => {
  const client = await pool.connect();
  try {
    // First, check if usuarioId already exists in integrantes to prevent duplicates
    const equipeResult = await client.query('SELECT integrantes FROM equipes WHERE id = $1;', [equipeId]);
    if (equipeResult.rows.length === 0) {
      return null; // Equipe not found
    }
    const integrantes = equipeResult.rows[0].integrantes || [];
    if (integrantes.includes(usuarioId)) {
      return equipeResult.rows[0]; // Usuario already in equipe, return current equipe
    }

    const query = `
      UPDATE equipes
      SET integrantes = array_append(integrantes, $1), updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const result = await client.query(query, [usuarioId, equipeId]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
};

export const removeIntegranteFromEquipe = async (equipeId: string, usuarioId: string): Promise<Equipe | null> => {
  const client = await pool.connect();
  try {
    const query = `
      UPDATE equipes
      SET integrantes = array_remove(integrantes, $1), updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const result = await client.query(query, [usuarioId, equipeId]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
};

export const addEventoToEquipe = async (equipeId: string, eventoId: string): Promise<Equipe | null> => {
  const client = await pool.connect();
  try {
     // First, check if eventoId already exists in eventos to prevent duplicates
     const equipeResult = await client.query('SELECT eventos FROM equipes WHERE id = $1;', [equipeId]);
     if (equipeResult.rows.length === 0) {
       return null; // Equipe not found
     }
     const eventos = equipeResult.rows[0].eventos || [];
     if (eventos.includes(eventoId)) {
       return equipeResult.rows[0]; // Evento already in equipe, return current equipe
     }

    const query = `
      UPDATE equipes
      SET eventos = array_append(eventos, $1), updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const result = await client.query(query, [eventoId, equipeId]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
};
