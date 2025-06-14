export interface Equipe {
  id: string;
  nome: string;
  integrantes: string[]; // Array de IDs dos usuários que fazem parte da equipe
  eventos: string[]; // Array de IDs dos eventos em que a equipe participa
  mediaPontuacao: number; // Média de pontuação da equipe em eventos
  presencaMedia: number; // Média de presença da equipe em eventos
  responsavel?: string; // ID do usuário responsável pela equipe
  maxmembros: number; // Número máximo de membros permitidos na equipe
  created_at?: Date; // Data de criação do registro
  updated_at?: Date; // Data da última atualização do registro
}
