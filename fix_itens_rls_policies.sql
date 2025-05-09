-- Habilitar RLS na tabela compras_itens
ALTER TABLE compras_itens ENABLE ROW LEVEL SECURITY;

-- Política para permitir operações de leitura para usuários autenticados
CREATE POLICY "Allow read operations for authenticated users"
  ON compras_itens
  FOR SELECT
  TO authenticated
  USING (true);

-- Política para permitir operações de inserção para usuários autenticados
CREATE POLICY "Allow insert operations for authenticated users"
  ON compras_itens
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política para permitir operações de atualização para usuários autenticados
CREATE POLICY "Allow update operations for authenticated users"
  ON compras_itens
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política para permitir operações de exclusão para usuários autenticados
CREATE POLICY "Allow delete operations for authenticated users"
  ON compras_itens
  FOR DELETE
  TO authenticated
  USING (true);

-- Conceder permissões aos usuários autenticados
GRANT ALL ON TABLE compras_itens TO authenticated;
GRANT ALL ON SEQUENCE compras_itens_id_seq TO authenticated; 