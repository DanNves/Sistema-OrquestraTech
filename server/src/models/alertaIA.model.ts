export interface AlertaIA {
  id: string;
  eventoId: string; // ID of the Evento related to the alert
  mensagem: string;
  tipo: 'info' | 'aviso' | 'erro'; // Example types of alerts
  dataCriacao: Date;
  resolvido: boolean;
  // Adicionar outros campos relevantes conforme necessário
}
