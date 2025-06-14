import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db';
import { Equipe } from '../models/equipe.model';

export const createEquipe = async (
  equipeData: Omit<Equipe, 'id' | 'mediaPontuacao' | 'presencaMedia' | 'eventos' | 'integrantes'> & { nome: string; responsavel?: string; maxmembros?: number; }
): Promise<Equipe> => {
  console.log('[%s] [equipeService.createEquipe] Dados recebidos para criação:', new Date().toISOString(), equipeData);
  const { nome, responsavel, maxmembros } = equipeData;
  console.log('[%s] [equipeService.createEquipe] maxmembros desestruturado:', new Date().toISOString(), maxmembros);
  const id = uuidv4();

  // Garantir que maxmembros seja um número inteiro, padrão 0 se não fornecido ou inválido
  const maxMembrosInt = typeof maxmembros === 'number' && !isNaN(maxmembros) ? Math.floor(maxmembros) : 0;
  console.log('[%s] [equipeService.createEquipe] maxMembrosInt calculado:', new Date().toISOString(), maxMembrosInt);

  // Garantir que integrantes seja um array
  const integrantes = responsavel ? [responsavel] : [];

  const newEquipe: Equipe = {
    id,
    nome,
    responsavel: responsavel || null,
    integrantes,
    eventos: [],
    mediaPontuacao: 0,
    presencaMedia: 0,
    maxmembros: maxMembrosInt,
  };
  console.log('[%s] [equipeService.createEquipe] Objeto newEquipe antes da inserção:', new Date().toISOString(), newEquipe);

  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO equipes (id, nome, responsavel, integrantes, eventos, mediaPontuacao, presencaMedia, maxmembros)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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
      newEquipe.maxmembros,
    ];
    console.log('[%s] [equipeService.createEquipe] Query de INSERT:', new Date().toISOString(), query);
    console.log('[%s] [equipeService.createEquipe] Valores para INSERT:', new Date().toISOString(), values);
    const result = await client.query(query, values);
    console.log('[%s] [equipeService.createEquipe] Resultado da inserção:', new Date().toISOString(), result.rows[0]);
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
    const result = await client.query('SELECT id, nome, responsavel, integrantes, eventos, mediaPontuacao, presencaMedia, maxmembros, created_at, updated_at FROM equipes WHERE id = $1;', [id]);
    
    console.log('[%s] [equipeService.getEquipeById] Resultado da query para ID %s:', new Date().toISOString(), id, result.rows[0]);

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
    console.log('[%s] [equipeService.updateEquipe] Recebido ID da equipe:', new Date().toISOString(), id);
    console.log('[%s] [equipeService.updateEquipe] Dados da equipeData recebidos para atualização:', new Date().toISOString(), equipeData);

    const existingEquipe = await getEquipeById(id);
    if (!existingEquipe) {
      return null;
    }

    const fieldsToUpdate: Partial<Equipe> = { updated_at: new Date() };
    const values = [];
    let valueCount = 1;
    let setClause = '';
    
    const allowedFields = [
        'nome', 'responsavel', 'integrantes', 'eventos', 'mediaPontuacao', 
        'presencaMedia', 'maxmembros'
    ];
    
    for (const key of allowedFields) {
        if (equipeData.hasOwnProperty(key) && key !== 'id') {
            let value = (equipeData as any)[key];

            if (key === 'maxmembros') {
                if (typeof value === 'number' && !isNaN(value)) {
                    value = Math.floor(value);
                    console.log('[%s] [equipeService.updateEquipe] maxmembros ajustado para:', new Date().toISOString(), value);
                } else {
                    value = 0;
                    console.log('[%s] [equipeService.updateEquipe] maxmembros inválido, ajustado para:', new Date().toISOString(), value);
                }
            }

            setClause += `${key} = $${valueCount}, `;
            values.push(value);
            valueCount++;
        }
    }

    if (setClause !== '') {
        setClause = setClause.slice(0, -2) + ', updated_at = CURRENT_TIMESTAMP';
    } else {
        setClause = 'updated_at = CURRENT_TIMESTAMP';
    }
    
    values.push(id);
    
    const query = `
      UPDATE equipes
      SET ${setClause}
      WHERE id = $${valueCount}
      RETURNING *;
    `;

    console.log('[%s] [equipeService.updateEquipe] Query de atualização:', new Date().toISOString(), query);
    console.log('[%s] [equipeService.updateEquipe] Valores para atualização:', new Date().toISOString(), values);

    const result = await client.query(query, values);
    console.log('[%s] [equipeService.updateEquipe] Resultado da atualização:', new Date().toISOString(), result.rows[0]);

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
    const equipeResult = await client.query('SELECT integrantes, maxmembros, responsavel FROM equipes WHERE id = $1;', [equipeId]);
    if (equipeResult.rows.length === 0) {
      return null;
    }

    const equipe = equipeResult.rows[0];
    const integrantes = equipe.integrantes || [];
    const maxmembros = equipe.maxmembros || 0;

    if (integrantes.includes(usuarioId)) {
      return equipeResult.rows[0];
    }

    if (maxmembros > 0 && integrantes.length >= maxmembros) {
      throw new Error(`A equipe já atingiu o limite máximo de ${maxmembros} membros`);
    }

    if (usuarioId === equipe.responsavel) {
      return equipeResult.rows[0];
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
