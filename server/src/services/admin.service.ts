import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db';
import { Admin } from '../models/admin.model'; // Assuming Admin model exists
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

// Helper to remove password_hash from admin object
const omitPasswordHash = (admin: Admin): Omit<Admin, 'password_hash'> => {
  const { password_hash, ...rest } = admin;
  return rest;
};

export const createAdmin = async (
  adminData: Omit<Admin, 'id' | 'created_at' | 'updated_at' | 'password_hash'> & { password: string }
): Promise<Omit<Admin, 'password_hash'>> => {
  const { nome, email, cargo, permissoes, password } = adminData;
  const id = uuidv4();
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO admins (id, nome, email, cargo, permissoes, password_hash)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [id, nome, email, cargo, permissoes || [], password_hash];
    const result = await client.query(query, values);
    return omitPasswordHash(result.rows[0]);
  } finally {
    client.release();
  }
};

export const getAllAdmins = async (): Promise<Omit<Admin, 'password_hash'>[]> => {
  const client = await pool.connect();
  try {
    // Ensure password_hash is selected for internal use but omitted for external return
    const result = await client.query('SELECT id, nome, email, cargo, permissoes, created_at, updated_at FROM admins;');
    return result.rows; // Already omits password_hash due to explicit selection
  } finally {
    client.release();
  }
};

export const getAdminById = async (id: string): Promise<Omit<Admin, 'password_hash'> | null> => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT id, nome, email, cargo, permissoes, created_at, updated_at FROM admins WHERE id = $1;', [id]);
    return result.rows[0] || null; // Already omits password_hash
  } finally {
    client.release();
  }
};

export const getAdminByEmail = async (email: string): Promise<Admin | null> => {
  const client = await pool.connect();
  try {
    // This function needs to return the password_hash for authentication
    const result = await client.query('SELECT * FROM admins WHERE email = $1;', [email]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
};

export const updateAdmin = async (
  id: string,
  adminData: Partial<Omit<Admin, 'id' | 'password_hash' | 'created_at' | 'updated_at'>> & { password?: string }
): Promise<Omit<Admin, 'password_hash'> | null> => {
  const client = await pool.connect();
  try {
    const existingAdmin = await client.query('SELECT * FROM admins WHERE id = $1 FOR UPDATE;', [id]);
    if (existingAdmin.rows.length === 0) {
      return null;
    }

    const fieldsToUpdate: { [key: string]: any } = { ...adminData };
    delete fieldsToUpdate.password; // Remove password from direct update fields

    if (adminData.password) {
      fieldsToUpdate.password_hash = await bcrypt.hash(adminData.password, SALT_ROUNDS);
    }
    fieldsToUpdate.updated_at = new Date();

    const allowedFields = ['nome', 'email', 'cargo', 'permissoes', 'password_hash', 'updated_at'];
    let setClause = '';
    const values = [];
    let valueCount = 1;

    for (const key in fieldsToUpdate) {
      if (fieldsToUpdate.hasOwnProperty(key) && allowedFields.includes(key)) {
        setClause += `${key} = $${valueCount}, `;
        values.push(fieldsToUpdate[key]);
        valueCount++;
      }
    }

    setClause = setClause.slice(0, -2);
    values.push(id);

    if (setClause === '') {
      return omitPasswordHash(existingAdmin.rows[0]);
    }

    const query = `
      UPDATE admins
      SET ${setClause}
      WHERE id = $${valueCount}
      RETURNING *;
    `;
    const result = await client.query(query, values);
    return omitPasswordHash(result.rows[0]);
  } finally {
    client.release();
  }
};

export const deleteAdmin = async (id: string): Promise<boolean> => {
  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM admins WHERE id = $1;', [id]);
    return result.rowCount > 0;
  } finally {
    client.release();
  }
};
