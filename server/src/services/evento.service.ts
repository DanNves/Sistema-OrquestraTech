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
    // Verificar se já existe um evento com o mesmo nome na mesma data e hora
    const checkQuery = `
      SELECT * FROM eventos 
      WHERE nome = $1 
      AND data = $2 
      AND horainicio = $3;
    `;
    const checkResult = await client.query(checkQuery, [nome.trim(), data, horaInicio]);
    
    if (checkResult.rows.length > 0) {
      throw new Error('Já existe um evento com este nome na mesma data e hora');
    }

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
    console.log('Buscando todos os eventos...');
    const result = await client.query('SELECT * FROM eventos ORDER BY data DESC;');
    console.log(`Encontrados ${result.rowCount} eventos`);
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const getEventoById = async (id: string): Promise<Evento | null> => {
  const client = await pool.connect();
  try {
    console.log(`Buscando evento com ID: ${id}`);
    const result = await client.query('SELECT * FROM eventos WHERE id = $1;', [id]);
    if (result.rows.length === 0) {
      console.log(`Evento com ID ${id} não encontrado`);
      return null;
    }
    console.log(`Evento encontrado: ${result.rows[0].nome}`);
    return result.rows[0];
  } catch (error) {
    console.error(`Erro ao buscar evento com ID ${id}:`, error);
    throw error;
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
    console.log(`Atualizando evento ${id}:`, eventData);
    
    // Primeiro, buscar o evento existente
    const existingEvento = await getEventoById(id);
    if (!existingEvento) {
      console.log(`Evento ${id} não encontrado para atualização`);
      return null;
    }

    const fieldsToUpdate: Partial<Omit<Evento, 'id' | 'inscricoes' | 'created_at' | 'updated_at' | 'mediaPontuacao'>> = {};
    
    // Permitir a atualização do status, independentemente do estado atual
    if (eventData.status !== undefined) {
      fieldsToUpdate.status = eventData.status;
    }

    // Para outros campos, aplicar a validação de estado
    const otherFields: (keyof Partial<Omit<Evento, 'id' | 'inscricoes' | 'created_at' | 'updated_at' | 'mediaPontuacao' | 'status'>>)[] = [
      'nome', 'data', 'descricao', 'local', 'equipesParticipantes', 'titulo', 'horaInicio', 'horaFim', 'tipo', 'participantes'
    ];

    for (const field of otherFields) {
      if (eventData[field] !== undefined) {
        if (existingEvento.status !== 'Programado') {
           throw new Error('Apenas eventos programados podem ter outros campos editados');
        }
        fieldsToUpdate[field] = eventData[field];
      }
    }

    // Se nenhum campo foi alterado (além de potencialmente o status), retornar o evento existente
    if (Object.keys(fieldsToUpdate).length === 0) {
       // Adicionar updated_at mesmo que nenhum campo tenha sido alterado
       const updateTimestampQuery = `UPDATE eventos SET "updated_at" = NOW() WHERE id = $1 RETURNING *;`;
       const result = await client.query(updateTimestampQuery, [id]);
       return result.rows[0] || null;
    }

    // Se estiver atualizando nome, data ou hora, verificar conflitos
    // Esta validação agora está dentro do loop de outros campos, mas vamos garantir que cubra a combinação
    if ( (eventData.nome !== undefined || eventData.data !== undefined || eventData.horaInicio !== undefined) && existingEvento.status === 'Programado' ) {
         const checkQuery = `
           SELECT * FROM eventos 
           WHERE nome = $1 
           AND data = $2 
           AND horainicio = $3
           AND id != $4;
         `;
         const checkResult = await client.query(checkQuery, [
           eventData.nome?.trim() || existingEvento.nome,
           eventData.data || existingEvento.data,
           eventData.horaInicio || existingEvento.horainicio,
           id
         ]);
         
         if (checkResult.rows.length > 0) {
           throw new Error('Já existe um evento com este nome na mesma data e hora');
         }
    }

    // Construir dinamicamente a query de update com base nos campos permitidos
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
            // A verificação de undefined já foi feita ao construir fieldsToUpdate
            if (dbColumnName) {
                setClause += `"${dbColumnName}" = $${valueCount}, `;
            values.push(fieldsToUpdate[key as keyof typeof fieldsToUpdate]);
            valueCount++;
        }
    }
    }

    // Se não há campos para atualizar (exceto updated_at, que é adicionado a seguir),
    // isso significa que apenas o status pode ter sido passado e já foi adicionado a fieldsToUpdate.
    // Ou, se fieldsToUpdate estava vazio, não precisamos fazer nada além de atualizar updated_at (lidado acima).
    // Se setClause ainda está vazio aqui, significa que fieldsToUpdate estava vazio.
    if (setClause === '') {
      // Isso não deve acontecer se o status foi passado, mas por segurança:
      if (Object.keys(fieldsToUpdate).length === 0) {
           // Nenhuma atualização de campos solicitada (além do updated_at)
           const updateTimestampQuery = `UPDATE eventos SET "updated_at" = NOW() WHERE id = $1 RETURNING *;`;
           const result = await client.query(updateTimestampQuery, [id]);
           return result.rows[0] || null;
      }
       // Se setClause está vazio mas fieldsToUpdate não, há um erro no mapeamento ou na lógica.
       // Neste ponto, fieldsToUpdate deve conter pelo menos o status se ele foi passado.
       // Se o status foi passado, setClause não deve estar vazio.
    }

    // Adicionar updated_at automaticamente
    setClause += `"updated_at" = NOW(), `;

    setClause = setClause.slice(0, -2); // Remove trailing comma and space
    values.push(id); // Para a cláusula WHERE
    
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
    console.log(`Deletando evento ${id}`);
    const result = await client.query('DELETE FROM eventos WHERE id = $1;', [id]);
    const deleted = result.rowCount > 0;
    console.log(`Evento ${id} ${deleted ? 'deletado com sucesso' : 'não encontrado'}`);
    return deleted;
  } catch (error) {
    console.error(`Erro ao deletar evento ${id}:`, error);
    throw error;
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
