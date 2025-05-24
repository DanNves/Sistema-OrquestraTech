export interface Usuario {
  id: string;
  nome: string;
  email: string;
  // Não armazenar senha em texto plano, usar hash
  // senhaHash: string; 
  tipo: 'participante' | 'organizador' | 'admin'; // Exemplo de tipos de usuário
  // Adicionar outros campos relevantes conforme necessário
}
