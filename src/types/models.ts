export interface Evento {
  id: string;
  // Add 'nome' if it's part of your backend Evento model and you want to use it in frontend
  // nome: string; 
  titulo: string;
  descricao: string;
  data: string; // ISO format (ex: '2025-06-12')
  horaInicio: string;
  horaFim: string;
  local: string;
  tipo: 'Palestra' | 'Oficina' | 'Show Técnico' | 'Outro';
  status: 'Programado' | 'Concluído' | 'Cancelado';
  equipesParticipantes: string[];
  participantes: string[];
  inscricoes?: any[]; // Define Inscricao interface later if needed for this view
  mediaPontuacao: number;
  created_at?: string;
  updated_at?: string;
}
