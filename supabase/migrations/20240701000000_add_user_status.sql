-- Adicionar campo status na tabela compras_usuarios
ALTER TABLE compras_usuarios ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'ativo';

-- Atualizar todos os usuários existentes para terem status 'ativo'
UPDATE compras_usuarios SET status = 'ativo' WHERE status IS NULL;

-- Criar índice para pesquisas rápidas por status
CREATE INDEX idx_usuarios_status ON compras_usuarios(status);

COMMENT ON COLUMN compras_usuarios.status IS 'Status do usuário: "ativo" ou "inativo"'; 