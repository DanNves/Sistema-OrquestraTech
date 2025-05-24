export interface Inscricao {
  id: string;
  eventoId: string; // ID of the Evento
  equipeId: string; // ID of the Equipe
  dataInscricao: Date;
  status: 'pendente' | 'confirmada' | 'rejeitada';
  // Adicionar outros campos relevantes conforme necessário
}
