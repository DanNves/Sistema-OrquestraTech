import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db';
import { Usuario } from '../models/usuario.model';
import bcrypt from 'bcrypt';

export const createUsuario = async (
  userData: Omit<Usuario, 'id' | 'score' | 'eventosParticipou' | 'ativo' | 'password_hash'> & { password: string }
): Promise<Usuario> => {
  const { nome, email, genero, idade, tipo, equipeId, ultimoEvento, password } = userData;
  
  const saltRounds = 10;
  const password_hash = await bcrypt.hash(password, saltRounds);

  const id = uuidv4();
  const newUsuario: Usuario = {
    id,
    nome,
    email,
    password_hash,
    genero,
    idade,
    tipo,
    eventosParticipou: [],
    score: 0,
    equipeId,
    ultimoEvento,
    ativo: true,
  };

  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO usuarios (
        id, nome, email, password_hash, genero, idade, tipo, eventosParticipou, 
        score, equipeId, ultimoEvento, ativo
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;
    const values = [
      newUsuario.id,
      newUsuario.nome,
      newUsuario.email,
      newUsuario.password_hash,
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
    const result = await client.query('SELECT * FROM usuarios;');
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

export const getUsuarioByEmail = async (email: string): Promise<Usuario | null> => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM usuarios WHERE email = $1;', [email]);
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
      return null;
    }

    const fieldsToUpdate = { ...existingUsuario, ...userData, updated_at: new Date() };
    
    if (userData.ativo !== undefined) {
        fieldsToUpdate.ativo = userData.ativo;
    }

    const allowedFields = [
        'nome', 'email', 'genero', 'idade', 'tipo', 'eventosParticipou', 
        'score', 'equipeId', 'ultimoEvento', 'ativo', 'updated_at', 'password_hash'
    ];
    
    let setClause = '';
    const values = [];
    let valueCount = 1;

    for (const key in fieldsToUpdate) {
        if (fieldsToUpdate.hasOwnProperty(key) && allowedFields.includes(key) && key !== 'id') {
            setClause += `"${key}" = $${valueCount}, `;
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

// Function for permanent deletion (hard delete)
export const hardDeleteUsuario = async (id: string): Promise<boolean> => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'DELETE FROM usuarios WHERE id = $1 RETURNING id;', 
      [id]
    );
    return result.rowCount > 0; // Returns true if a row was deleted
  } finally {
    client.release();
  }
};
