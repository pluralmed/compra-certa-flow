-- Create status history table
CREATE TABLE compras_historico_status (
  id SERIAL PRIMARY KEY,
  solicitacao_id INTEGER NOT NULL REFERENCES compras_solicitacoes(id) ON DELETE CASCADE,
  status VARCHAR(255) NOT NULL,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::text, NOW()) NOT NULL,
  usuario_id INTEGER NOT NULL REFERENCES compras_usuarios(id)
);

-- Create index for faster lookups
CREATE INDEX idx_historico_status_solicitacao ON compras_historico_status(solicitacao_id);

-- Add trigger to automatically add status changes to history
CREATE OR REPLACE FUNCTION fn_add_status_history()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') OR (OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO compras_historico_status (solicitacao_id, status, usuario_id)
    VALUES (NEW.id, NEW.status, NEW.usuario_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_add_status_history
AFTER INSERT OR UPDATE ON compras_solicitacoes
FOR EACH ROW
EXECUTE FUNCTION fn_add_status_history();

-- Add RLS policies for compras_historico_status
ALTER TABLE compras_historico_status ENABLE ROW LEVEL SECURITY;

-- Policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users"
  ON compras_historico_status
  FOR ALL
  TO authenticated
  USING (true);

-- Policy to allow trigger to insert records
CREATE POLICY "Allow trigger to insert records"
  ON compras_historico_status
  FOR INSERT
  TO postgres
  WITH CHECK (true); 