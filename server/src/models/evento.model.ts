export interface Evento {
  id: string;
  nome: string;
  data: Date;
  descricao: string;
  local: string;
  equipesParticipantes: string[]; // Array of Equipe IDs
  // Adicionar outros campos relevantes conforme necessário
}
