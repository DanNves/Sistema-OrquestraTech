export interface Evento {
  id: string;
  nome: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  local: string;
  status: 'Pendente' | 'Em Andamento' | 'Concluído';
  equipeId: string;
  criadoEm: string;
  atualizadoEm: string;
} 