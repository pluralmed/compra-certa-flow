-- Inserir grupos de itens de teste (se não existirem)
INSERT INTO compras_grupos_itens (nome, data_criacao)
SELECT 'Material de Escritório', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM compras_grupos_itens WHERE nome = 'Material de Escritório');

INSERT INTO compras_grupos_itens (nome, data_criacao)
SELECT 'Material de Limpeza', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM compras_grupos_itens WHERE nome = 'Material de Limpeza');

INSERT INTO compras_grupos_itens (nome, data_criacao)
SELECT 'Equipamentos', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM compras_grupos_itens WHERE nome = 'Equipamentos');

-- Inserir unidades de medida de teste (se não existirem)
INSERT INTO compras_unidades_medida (nome, sigla, data_criacao)
SELECT 'Unidade', 'Un', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM compras_unidades_medida WHERE sigla = 'Un');

INSERT INTO compras_unidades_medida (nome, sigla, data_criacao)
SELECT 'Caixa', 'Cx', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM compras_unidades_medida WHERE sigla = 'Cx');

INSERT INTO compras_unidades_medida (nome, sigla, data_criacao)
SELECT 'Pacote', 'Pct', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM compras_unidades_medida WHERE sigla = 'Pct');

-- Obter IDs dos grupos e unidades
WITH grupos AS (
    SELECT id FROM compras_grupos_itens WHERE nome = 'Material de Escritório' LIMIT 1
),
unidades AS (
    SELECT id FROM compras_unidades_medida WHERE sigla = 'Un' LIMIT 1
)
-- Inserir itens de teste (se não existirem)
INSERT INTO compras_itens (nome, grupo_id, unidade_medida_id, valor_medio, data_criacao)
SELECT 'Caneta Esferográfica Azul', g.id, u.id, 2.50, CURRENT_TIMESTAMP
FROM grupos g, unidades u
WHERE NOT EXISTS (SELECT 1 FROM compras_itens WHERE nome = 'Caneta Esferográfica Azul');

-- Material de Escritório / Cx
WITH grupos AS (
    SELECT id FROM compras_grupos_itens WHERE nome = 'Material de Escritório' LIMIT 1
),
unidades AS (
    SELECT id FROM compras_unidades_medida WHERE sigla = 'Cx' LIMIT 1
)
INSERT INTO compras_itens (nome, grupo_id, unidade_medida_id, valor_medio, data_criacao)
SELECT 'Papel A4', g.id, u.id, 25.00, CURRENT_TIMESTAMP
FROM grupos g, unidades u
WHERE NOT EXISTS (SELECT 1 FROM compras_itens WHERE nome = 'Papel A4');

-- Material de Limpeza / Un
WITH grupos AS (
    SELECT id FROM compras_grupos_itens WHERE nome = 'Material de Limpeza' LIMIT 1
),
unidades AS (
    SELECT id FROM compras_unidades_medida WHERE sigla = 'Un' LIMIT 1
)
INSERT INTO compras_itens (nome, grupo_id, unidade_medida_id, valor_medio, data_criacao)
SELECT 'Desinfetante', g.id, u.id, 15.90, CURRENT_TIMESTAMP
FROM grupos g, unidades u
WHERE NOT EXISTS (SELECT 1 FROM compras_itens WHERE nome = 'Desinfetante');

-- Material de Limpeza / Pct
WITH grupos AS (
    SELECT id FROM compras_grupos_itens WHERE nome = 'Material de Limpeza' LIMIT 1
),
unidades AS (
    SELECT id FROM compras_unidades_medida WHERE sigla = 'Pct' LIMIT 1
)
INSERT INTO compras_itens (nome, grupo_id, unidade_medida_id, valor_medio, data_criacao)
SELECT 'Papel Higiênico', g.id, u.id, 18.50, CURRENT_TIMESTAMP
FROM grupos g, unidades u
WHERE NOT EXISTS (SELECT 1 FROM compras_itens WHERE nome = 'Papel Higiênico');

-- Equipamentos / Un
WITH grupos AS (
    SELECT id FROM compras_grupos_itens WHERE nome = 'Equipamentos' LIMIT 1
),
unidades AS (
    SELECT id FROM compras_unidades_medida WHERE sigla = 'Un' LIMIT 1
)
INSERT INTO compras_itens (nome, grupo_id, unidade_medida_id, valor_medio, data_criacao)
SELECT 'Mouse sem fio', g.id, u.id, 45.00, CURRENT_TIMESTAMP
FROM grupos g, unidades u
WHERE NOT EXISTS (SELECT 1 FROM compras_itens WHERE nome = 'Mouse sem fio');

-- Equipamentos / Un
WITH grupos AS (
    SELECT id FROM compras_grupos_itens WHERE nome = 'Equipamentos' LIMIT 1
),
unidades AS (
    SELECT id FROM compras_unidades_medida WHERE sigla = 'Un' LIMIT 1
)
INSERT INTO compras_itens (nome, grupo_id, unidade_medida_id, valor_medio, data_criacao)
SELECT 'Teclado', g.id, u.id, 65.00, CURRENT_TIMESTAMP
FROM grupos g, unidades u
WHERE NOT EXISTS (SELECT 1 FROM compras_itens WHERE nome = 'Teclado'); 