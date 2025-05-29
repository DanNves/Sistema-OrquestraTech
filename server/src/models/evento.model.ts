export interface Evento {
  id: string;
  nome: string;
  data: Date;
  descricao: string;
  local: string;
  equipesParticipantes: string[]; // Array of Equipe IDs
  titulo: string;
  horaInicio: string; // Pode ser string 'HH:MM' ou Date/Time
  horaFim: string;   // Pode ser string 'HH:MM' ou Date/Time
  tipo: 'Palestra' | 'Oficina' | 'Show Técnico' | 'Outro'; // Exemplo de enum/union types
  status: 'Programado' | 'Concluído' | 'Cancelado'; // Exemplo de enum/union types
  participantes: string[]; // Array de IDs de usuários ou similar
  mediaPontuacao: number; // Média de pontuação das avaliações
  inscricoes?: string[]; // IDs das inscrições relacionadas (opcional, dependendo da modelagem)
  created_at?: Date; // Opcional, gerado pelo banco de dados
  updated_at?: Date; // Opcional, gerado pelo banco de dados
  // Adicionar outros campos relevantes conforme necessário
}
