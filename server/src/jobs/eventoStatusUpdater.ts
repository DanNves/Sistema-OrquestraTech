import cron from 'node-cron';
import pool from '../config/db';

// Função para verificar e atualizar o status dos eventos
const updateEventoStatus = async () => {
  console.log('[%s] [Job] Executando updateEventoStatus...', new Date().toISOString());
  const client = await pool.connect();
  try {
    // --- Debugging específico para o evento fornecido ---
    const eventIdToDebug = 'ec890f06-f404-46fd-ae11-735298b7cbd1';
    try {
        const debugEventQuery = 'SELECT id, nome, status, data, horainicio, horafim FROM eventos WHERE id = $1';
        const debugEventResult = await client.query(debugEventQuery, [eventIdToDebug]);
        if (debugEventResult.rows.length > 0) {
            console.log('[%s] [Job - Debug] Estado do evento %s:', new Date().toISOString(), eventIdToDebug, debugEventResult.rows[0]);
        } else {
            console.log('[%s] [Job - Debug] Evento %s não encontrado.', new Date().toISOString(), eventIdToDebug);
        }
    } catch (debugError) {
        console.error('[%s] [Job - Debug] Erro ao buscar evento para debug:', new Date().toISOString(), debugError);
    }
    // --- Fim do Debugging específico ---

    // Lógica para marcar eventos como 'Em Andamento'
    // Compara a combinação da data e hora de início do evento com o timestamp atual
    const startQuery = `
      UPDATE eventos
      SET status = 'Em Andamento'
      WHERE status = 'Programado'
      AND (data::TIMESTAMP + horainicio::INTERVAL) <= NOW();
    `;
    console.log('[%s] [Job] Executando query para iniciar eventos:', new Date().toISOString(), startQuery);
    const startResult = await client.query(startQuery);
    console.log('[%s] [Job] Query para iniciar eventos executada. Row count:', new Date().toISOString(), startResult.rowCount);
    if (startResult.rowCount > 0) {
      console.log(`Job: ${startResult.rowCount} evento(s) atualizado(s) para Em Andamento.`);
      // Opcional: buscar e logar os nomes dos eventos atualizados
    }

    // Lógica para marcar eventos como 'Concluído'
    // Compara a combinação da data e hora de término do evento com o timestamp atual
    const endQuery = `
      UPDATE eventos
      SET status = 'Concluído'
      WHERE status = 'Em Andamento'
      AND (data::TIMESTAMP + horafim::INTERVAL) <= NOW();
    `;
    console.log('[%s] [Job] Executando query para concluir eventos:', new Date().toISOString(), endQuery);
    const endResult = await client.query(endQuery);
    console.log('[%s] [Job] Query para concluir eventos executada. Row count:', new Date().toISOString(), endResult.rowCount);
    if (endResult.rowCount > 0) {
      console.log(`Job: ${endResult.rowCount} evento(s) atualizado(s) para Concluído.`);
      // Opcional: buscar e logar os nomes dos eventos atualizados
    }

  } catch (error) {
    console.error('Job: Erro ao atualizar status de eventos:', error);
  } finally {
    client.release();
  }
};

// Agendar o job para rodar a cada minuto
export const startEventoStatusUpdater = () => {
  console.log('[%s] [Job] Agendando job de atualização de status de eventos...', new Date().toISOString());
  cron.schedule('* * * * *', () => {
    console.log('[%s] [Job] Cron job acionado...', new Date().toISOString());
    updateEventoStatus();
  });
  console.log('Job: Job de atualização de status de eventos agendado para rodar a cada minuto.');
}; 