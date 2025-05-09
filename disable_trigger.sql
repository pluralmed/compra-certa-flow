-- Desativar o trigger que está causando o problema
ALTER TABLE compras_solicitacoes DISABLE TRIGGER trg_add_status_history;

-- Para reativar o trigger posteriormente, use:
-- ALTER TABLE compras_solicitacoes ENABLE TRIGGER trg_add_status_history; 