export interface Equipe {
  id: string;
  nome: string;
  membros: string[]; // Array of Usuario IDs
  responsavel?: string; // Adicionado campo responsavel
  // Adicionar outros campos relevantes conforme necessário
}
