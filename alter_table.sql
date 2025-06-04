-- Remover o valor padrão da coluna maxmembros
ALTER TABLE equipes ALTER COLUMN maxmembros DROP DEFAULT;

-- Verificar a estrutura atual da tabela
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'equipes'; 