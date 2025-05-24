import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db';
import { Usuario } from '../models/usuario.model';

export const createUsuario = async (
  userData: Omit<Usuario, 'id' | 'score' | 'eventosParticipou' | 'ativo'>
): Promise<Usuario> => {
  const { nome, email, genero, idade, tipo, equipeId, ultimoEvento } = userData;
  const id = uuidv4();
  const newUsuario: Usuario = {
    id,
    nome,
    email,
    genero,
    idade,
    tipo,
    eventosParticipou: [], // Default value
    score: 0, // Default value
    equipeId,
    ultimoEvento,
    ativo: true, // Default value
    // created_at and updated_at will be handled by the database
  };

  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO usuarios (
        id, nome, email, genero, idade, tipo, eventosParticipou, 
        score, equipeId, ultimoEvento, ativo
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;
    const values = [
      newUsuario.id,
      newUsuario.nome,
      newUsuario.email,
      newUsuario.genero,
      newUsuario.idade,
      newUsuario.tipo,
      newUsuario.eventosParticipou,
      newUsuario.score,
      newUsuario.equipeId,
      newUsuario.ultimoEvento,
      newUsuario.ativo,
    ];
    const result = await client.query(query, values);
    return result.rows[0];
  } finally {
    client.release();
  }
};

export const getAllUsuarios = async (): Promise<Usuario[]> => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM usuarios WHERE ativo = true;'); // Only return active users
    return result.rows;
  } finally {
    client.release();
  }
};

export const getUsuarioById = async (id: string): Promise<Usuario | null> => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM usuarios WHERE id = $1 AND ativo = true;', [id]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
};

export const updateUsuario = async (
  id: string,
  userData: Partial<Omit<Usuario, 'id'>>
): Promise<Usuario | null> => {
  const client = await pool.connect();
  try {
    const existingUsuario = await getUsuarioById(id);
    if (!existingUsuario) {
      return null; // Or throw an error if user not found or not active
    }

    // Merge existing data with new data
    const fieldsToUpdate = { ...existingUsuario, ...userData, updated_at: new Date() };
    
    // Ensure 'ativo' is handled correctly if it's part of userData
    if (userData.ativo !== undefined) {
        fieldsToUpdate.ativo = userData.ativo;
    }

    const allowedFields = [
        'nome', 'email', 'genero', 'idade', 'tipo', 'eventosParticipou', 
        'score', 'equipeId', 'ultimoEvento', 'ativo', 'updated_at'
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
        return existingUsuario; 
    }
    
    const query = `
      UPDATE usuarios
      SET ${setClause}
      WHERE id = $${valueCount} AND ativo = true
      RETURNING *;
    `;
    const result = await client.query(query, values);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
};

// Soft delete by setting 'ativo' to false
export const deleteUsuario = async (id: string): Promise<boolean> => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE usuarios SET ativo = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND ativo = true RETURNING id;', 
      [id]
    );
    return result.rowCount > 0;
  } finally {
    client.release();
  }
};
