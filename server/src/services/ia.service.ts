import { pool } from '../config/db';
import { v4 as uuidv4 } from 'uuid';

interface AlertaIA {
  id: string;
  tipo: 'Ausência' | 'Baixa Pontuação' | 'Inscrição Baixa' | 'Sugestão';
  mensagem: string;
  data: Date;
  eventoRelacionadoId?: string;
  read: boolean;
  created_at: Date;
}

export const createAlertaIA = async (alerta: Omit<AlertaIA, 'id' | 'created_at'>): Promise<AlertaIA> => {
  const client = await pool.connect();
  try {
    const id = uuidv4();
    const result = await client.query(
      `INSERT INTO alertas_ia (id, tipo, mensagem, data, eventoRelacionadoId, read)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [id, alerta.tipo, alerta.mensagem, alerta.data, alerta.eventoRelacionadoId, alerta.read]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

export const getAlertasIA = async (): Promise<AlertaIA[]> => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM alertas_ia ORDER BY data DESC`
    );
    return result.rows;
  } finally {
    client.release();
  }
};

export const marcarAlertaComoLido = async (id: string): Promise<AlertaIA> => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE alertas_ia SET read = true WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

// Função para gerar alertas baseados em análise de dados
export const gerarAlertasAutomaticos = async () => {
  const client = await pool.connect();
  try {
    // 1. Verificar eventos com baixa inscrição
    const eventosBaixaInscricao = await client.query(
      `SELECT id, nome, data, participantes 
       FROM eventos 
       WHERE status = 'Programado' 
       AND array_length(participantes, 1) < 5`
    );

    for (const evento of eventosBaixaInscricao.rows) {
      await createAlertaIA({
        tipo: 'Inscrição Baixa',
        mensagem: `Evento "${evento.nome}" tem poucos participantes inscritos`,
        data: new Date(),
        eventoRelacionadoId: evento.id,
        read: false
      });
    }

    // 2. Verificar padrões de ausência
    const ausencias = await client.query(
      `SELECT u.id, u.nome, COUNT(*) as ausencias
       FROM usuarios u
       JOIN inscricoes i ON u.id = i.usuarioId
       WHERE i.status = 'Cancelada'
       GROUP BY u.id, u.nome
       HAVING COUNT(*) >= 3`
    );

    for (const ausencia of ausencias.rows) {
      await createAlertaIA({
        tipo: 'Ausência',
        mensagem: `Usuário ${ausencia.nome} tem um histórico de ${ausencia.ausencias} ausências`,
        data: new Date(),
        read: false
      });
    }

    // 3. Verificar eventos com baixa pontuação
    const eventosBaixaPontuacao = await client.query(
      `SELECT id, nome, mediaPontuacao
       FROM eventos
       WHERE status = 'Concluído'
       AND mediaPontuacao < 7
       AND data > CURRENT_DATE - INTERVAL '30 days'`
    );

    for (const evento of eventosBaixaPontuacao.rows) {
      await createAlertaIA({
        tipo: 'Baixa Pontuação',
        mensagem: `Evento "${evento.nome}" teve uma avaliação média de ${evento.mediaPontuacao}`,
        data: new Date(),
        eventoRelacionadoId: evento.id,
        read: false
      });
    }

  } finally {
    client.release();
  }
}; 