export interface Usuario {
  id: string;
  nome: string;
  email: string;
  password_hash: string; // Campo para armazenar o hash da senha
  tipo: 'participante' | 'organizador' | 'admin'; // Exemplo de tipos de usuário
  ativo: boolean; // Novo campo para indicar se o usuário está ativo
  // Adicionar outros campos relevantes conforme necessário
}
