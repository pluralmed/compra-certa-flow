-- Execute este SQL no seu banco de dados Supabase para adicionar o campo status na tabela de usuários
ALTER TABLE compras_usuarios ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'ativo';

-- Atualizar todos os usuários existentes para terem status 'ativo'
UPDATE compras_usuarios SET status = 'ativo' WHERE status IS NULL;

-- Criar índice para pesquisas rápidas por status
CREATE INDEX idx_usuarios_status ON compras_usuarios(status);

-- Adicionar comentário explicativo ao campo
COMMENT ON COLUMN compras_usuarios.status IS 'Status do usuário: "ativo" ou "inativo"'; 