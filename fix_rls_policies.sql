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

-- Ensure the trigger function has the necessary permissions
GRANT ALL ON TABLE compras_historico_status TO postgres;
GRANT ALL ON SEQUENCE compras_historico_status_id_seq TO postgres;

-- Grant permissions to authenticated users
GRANT ALL ON TABLE compras_historico_status TO authenticated;
GRANT ALL ON SEQUENCE compras_historico_status_id_seq TO authenticated; 