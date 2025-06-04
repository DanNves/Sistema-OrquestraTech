-- Primeiro, vamos verificar a estrutura atual da tabela
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'equipes';

-- Remover o valor padrão da coluna maxmembros
ALTER TABLE equipes ALTER COLUMN maxmembros DROP DEFAULT;

-- Atualizar registros existentes para garantir que maxmembros seja 0 onde for NULL
UPDATE equipes SET maxmembros = 0 WHERE maxmembros IS NULL;

-- Verificar se a alteração foi feita corretamente
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'equipes';

-- Verificar os dados atuais
SELECT id, nome, maxmembros FROM equipes; 