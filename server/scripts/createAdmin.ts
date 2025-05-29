import { createAdmin } from '../src/services/admin.service';
import pool from '../src/config/db';
import dotenv from 'dotenv';
import { Admin } from '../src/models/admin.model';

dotenv.config();

const runScript = async () => {
  // Dados do usuário administrador que você quer criar
  // Explicitamente tipar para garantir que o cargo seja reconhecido corretamente
  const adminData: Omit<Admin, 'id' | 'created_at' | 'updated_at' | 'password_hash'> & { password: string } = {
    nome: 'Daniel', // <-- Substituído pelo nome fornecido
    email: 'nevesdanniel021@hotmail.com', // <-- SUBSTITUÍDO PELO EMAIL FORNECIDO
    cargo: 'SuperAdmin', // Definir como SuperAdmin
    permissoes: ['gerenciar_usuarios', 'gerenciar_eventos', 'gerenciar_equipes', 'gerenciar_avaliacoes'], // Exemplo de permissões
  };

  // Como a senha foi removida do objeto adminData acima,
  // precisamos adicionar a senha de volta APENAS para a chamada da função createAdmin
  // Você pode definir a senha em uma variável separada aqui
  const adminPassword = 'Jesus@2110'; // <-- Defina a senha aqui temporariamente se precisar recriar

  // Para fins de segurança, é MELHOR remover a senha completamente do script
  // e apenas usá-lo para criar o PRIMEIRO admin. Para criar outros admins,
  // use a funcionalidade de cadastro/criação de admin no sistema, que usa hashing.
  
  // Se você precisar executar este script novamente para criar o mesmo admin
  // ou um admin diferente, você precisará adicionar a linha de volta
  // com a senha ou definir a variável adminPassword acima.

  try {
    // Tentar conectar ao banco de dados
    await pool.connect();
    console.log('Conectado ao banco de dados.');

    // Verificar se o usuário já existe pelo email
    const existingAdmin = await pool.query('SELECT id FROM admins WHERE email = $1', [adminData.email]);
    if (existingAdmin.rows.length > 0) {
      console.log(`Erro: Já existe um usuário com este email: ${adminData.email}`);
      console.log('Conexão com o banco de dados encerrada.');
      await pool.end();
      return;
    }

    // Criar o usuário administrador usando o serviço (que já faz o hash da senha)
    // Incluir a senha para a chamada da função createAdmin
    const adminDataWithPassword = { ...adminData, password: adminPassword };
    const newAdmin = await createAdmin(adminDataWithPassword);
    console.log('Usuário administrador criado com sucesso:', newAdmin);

  } catch (error: any) {
    console.error('Erro ao criar usuário administrador:', error);
  } finally {
    // Fechar a conexão com o banco de dados
    await pool.end();
    console.log('Conexão com o banco de dados encerrada.');
  }
};

runScript(); 