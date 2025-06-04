export interface Equipe {
  id: string;
  nome: string;
  integrantes: string[]; // Array of Usuario IDs
  eventos: string[]; // Array of Evento IDs
  mediaPontuacao: number;
  presencaMedia: number;
  responsavel?: string;
  maxmembros: number;
  created_at?: Date;
  updated_at?: Date;
}
