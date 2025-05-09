-- Habilitar o schema auth para poder acessá-lo
GRANT usage ON schema auth TO postgres;
GRANT SELECT ON auth.users TO postgres;

-- Criar função para sincronizar usuários entre auth.users e compras_usuarios
CREATE OR REPLACE FUNCTION public.sync_auth_user_to_compras_usuario()
RETURNS TRIGGER AS $$
DECLARE
  user_exists_in_compras BOOLEAN;
  compras_user_id INTEGER;
BEGIN
  -- Verificar se o usuário já existe na tabela compras_usuarios
  SELECT EXISTS (
    SELECT 1 FROM compras_usuarios WHERE email = NEW.email INTO user_exists_in_compras
  );
  
  -- Se o usuário não existir na tabela compras_usuarios, criar um novo
  IF NOT user_exists_in_compras THEN
    -- Extrair informações do metadata (se disponível)
    INSERT INTO compras_usuarios (
      email,
      nome,
      sobrenome,
      senha,
      whatsapp,
      setor,
      tipo_permissao,
      status,
      data_criacao
    ) VALUES (
      NEW.email,
      COALESCE((NEW.raw_user_meta_data->>'name')::TEXT, 'Novo'),
      COALESCE((NEW.raw_user_meta_data->>'last_name')::TEXT, 'Usuário'),
      -- Armazenar hash da senha (não podemos acessar a senha diretamente)
      crypt(gen_random_uuid()::TEXT, gen_salt('bf')),
      COALESCE((NEW.raw_user_meta_data->>'whatsapp')::TEXT, ''),
      COALESCE((NEW.raw_user_meta_data->>'sector')::TEXT, 'Não especificado'),
      'normal',
      'ativo',
      NOW()
    ) RETURNING id INTO compras_user_id;

    -- Atualizar metadados do usuário auth com o ID do compras_usuario
    UPDATE auth.users
    SET raw_user_meta_data = 
      jsonb_set(
        COALESCE(raw_user_meta_data, '{}'::jsonb),
        '{compras_user_id}',
        to_jsonb(compras_user_id::TEXT)
      )
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger que é acionado quando um novo usuário é criado na tabela auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_auth_user_to_compras_usuario();

-- Criar função para sincronizar status entre tabelas
CREATE OR REPLACE FUNCTION public.sync_compras_usuario_status_to_auth()
RETURNS TRIGGER AS $$
BEGIN
  -- Quando o status de um usuário é alterado na tabela compras_usuarios
  -- Atualizar o metadata correspondente na tabela auth.users
  IF NEW.status <> OLD.status THEN
    UPDATE auth.users
    SET raw_user_meta_data = 
      jsonb_set(
        COALESCE(raw_user_meta_data, '{}'::jsonb),
        '{disabled}',
        to_jsonb(NEW.status = 'inativo')
      )
    WHERE raw_user_meta_data->>'compras_user_id' = NEW.id::TEXT
    OR email = NEW.email;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger que é acionado quando o status de um usuário é alterado na tabela compras_usuarios
CREATE OR REPLACE TRIGGER on_compras_usuario_status_changed
  AFTER UPDATE OF status ON compras_usuarios
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_compras_usuario_status_to_auth();

-- Criar função para sincronizar atualizações de email entre tabelas
CREATE OR REPLACE FUNCTION public.sync_compras_usuario_email_to_auth()
RETURNS TRIGGER AS $$
BEGIN
  -- Quando o email de um usuário é alterado na tabela compras_usuarios
  -- Atualizar o email correspondente na tabela auth.users
  IF NEW.email <> OLD.email THEN
    UPDATE auth.users
    SET email = NEW.email
    WHERE raw_user_meta_data->>'compras_user_id' = NEW.id::TEXT
    OR email = OLD.email;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger que é acionado quando o email de um usuário é alterado na tabela compras_usuarios
CREATE OR REPLACE TRIGGER on_compras_usuario_email_changed
  AFTER UPDATE OF email ON compras_usuarios
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_compras_usuario_email_to_auth(); 