import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db';
import { Evento } from '../models/evento.model';
import { PoolClient } from 'pg';

export const createEvento = async (
  eventData: Omit<Evento, 'id' | 'mediaPontuacao' | 'inscricoes' | 'created_at' | 'updated_at'>
): Promise<Evento> => {
  const { nome, data, descricao, local, equipesParticipantes, horaInicio, horaFim, tipo, status, participantes } = eventData;
  
  // Validações
  if (!nome || !nome.trim()) {
    throw new Error('Nome do evento é obrigatório');
  }
  if (!data) {
    throw new Error('Data do evento é obrigatória');
  }
  if (!horaInicio) {
    throw new Error('Hora de início é obrigatória');
  }
  if (!horaFim) {
    throw new Error('Hora de término é obrigatória');
  }
  if (!local || !local.trim()) {
    throw new Error('Local do evento é obrigatório');
  }
  if (!tipo) {
    throw new Error('Tipo do evento é obrigatório');
  }
  if (tipo !== 'Ensaio de Seção' && tipo !== 'Ensaio Geral' && tipo !== 'Encontro Técnico') {
    throw new Error('Tipo de evento inválido. Deve ser "Ensaio de Seção", "Ensaio Geral" ou "Encontro Técnico"');
  }
  if (!status) {
    throw new Error('Status do evento é obrigatório');
  }

  // Validar se a hora de término é posterior à hora de início
  const horaInicioDate = new Date(`2000-01-01T${horaInicio}`);
  const horaFimDate = new Date(`2000-01-01T${horaFim}`);
  if (horaFimDate <= horaInicioDate) {
    throw new Error('A hora de término deve ser posterior à hora de início');
  }

  const id = uuidv4();
  
  const client = await pool.connect();
  try {
    console.log('Dados recebidos para criação:', eventData); // Debug

    const query = `
      INSERT INTO eventos (
        id, nome, data, descricao, local, equipesParticipantes,
        titulo, horaInicio, horaFim, tipo, status, participantes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;
    // Usar o valor de 'nome' para preencher o campo 'titulo'
    const titulo = nome.trim(); 

    const values = [
      id, nome.trim(), data, descricao?.trim() || '', local.trim(), equipesParticipantes || [],
      titulo, horaInicio, horaFim, tipo, status, participantes || []
    ];

    console.log('Valores para inserção:', values); // Debug

    const result = await client.query(query, values);
    console.log('Evento criado:', result.rows[0]); // Debug
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
  eventData: Partial<Omit<Evento, 'id' | 'inscricoes' | 'created_at' | 'updated_at' | 'mediaPontuacao'>>
): Promise<Evento | null> => {
  const client = await pool.connect();
  try {
    const existingEvento = await getEventoById(id);
    if (!existingEvento) {
      return null;
    }

    // Construir dinamicamente a query de update
    const fieldsToUpdate = eventData;
    // Mapeamento de campos camelCase para nomes de coluna snake_case (ou lowercase)
    const columnMapping: { [key: string]: string } = {
      nome: 'nome',
      data: 'data',
      descricao: 'descricao',
      local: 'local',
      equipesParticipantes: 'equipesparticipantes', // Corrigido para lowercase
      titulo: 'titulo',
      horaInicio: 'horainicio', // Corrigido para lowercase
      horaFim: 'horafim', // Corrigido para lowercase
      tipo: 'tipo',
      status: 'status',
      participantes: 'participantes' // Corrigido para lowercase
      // mediaPontuacao não está incluído aqui pois é calculado
    };

    let setClause = '';
    const values = [];
    let valueCount = 1;

    for (const key in fieldsToUpdate) {
        if (fieldsToUpdate.hasOwnProperty(key)) {
            const dbColumnName = columnMapping[key];
            // Verificar se o campo é permitido e tem um valor definido
            if (dbColumnName && fieldsToUpdate[key as keyof typeof fieldsToUpdate] !== undefined) {
                setClause += `"${dbColumnName}" = $${valueCount}, `;
                values.push(fieldsToUpdate[key as keyof typeof fieldsToUpdate]);
                valueCount++;
            }
        }
    }

    // Adicionar updated_at automaticamente
    setClause += `"updated_at" = NOW(), `;

    setClause = setClause.slice(0, -2); // Remove trailing comma and space
    values.push(id); // Para a cláusula WHERE

    // Se nada além de updated_at foi alterado, não precisa executar o UPDATE
    if (setClause === '"updated_at" = NOW()') {
         // Buscar e retornar o evento atualizado para refletir o updated_at
         return getEventoById(id);
    }

    const query = `
      UPDATE eventos
      SET ${setClause}
      WHERE id = $${valueCount}
      RETURNING *;
    `;

    console.log('Update query:', query);
    console.log('Update values:', values);

    const result = await client.query(query, values);
    console.log('Evento atualizado:', result.rows[0]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
};

export const deleteEvento = async (id: string): Promise<boolean> => {
  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM eventos WHERE id = $1;', [id]);
    return result.rowCount! > 0; // Retorna true se alguma linha foi excluída
  } finally {
    client.release();
  }
};

// Função auxiliar para atualizar a média de pontuação de um evento (se aplicável)
// Pode ser chamada após a criação/atualização/exclusão de avaliações relacionadas a um evento.
export const updateEventoMediaPontuacao = async (eventoId: string, client?: PoolClient): Promise<void> => {
  const currentClient = client || await pool.connect();
  try {
    const query = `
      SELECT AVG(pontuacao) as media
      FROM avaliacoes
      WHERE "eventoId" = $1;
    `;
    const result = await currentClient.query(query, [eventoId]);
    const media = result.rows[0].media || 0;

    const updateQuery = `
      UPDATE eventos
      SET "mediaPontuacao" = $1
      WHERE id = $2;
    `;
    await currentClient.query(updateQuery, [media, eventoId]);
    console.log(`Média de pontuação para o evento ${eventoId} atualizada para ${media}`);
  } catch (error) {
    console.error(`Erro ao atualizar média de pontuação para o evento ${eventoId}:`, error);
  } finally {
    if (!client) {
      currentClient.release();
    }
  }
};

// TODO: Adicionar funções para gerenciar equipesParticipantes e participantes (adicionar/remover)
// TODO: Adicionar funções para gerenciar inscrições relacionadas a eventos
