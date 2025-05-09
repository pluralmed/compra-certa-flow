-- Esta migração cria um novo usuário no sistema auth.users para cada usuário existente
-- na tabela compras_usuarios que ainda não tenha um vínculo

-- Função para migrar usuários existentes
CREATE OR REPLACE FUNCTION public.migrate_existing_users_to_auth()
RETURNS void AS $$
DECLARE
    usuario RECORD;
    auth_user_id UUID;
BEGIN
    -- Iterando por todos os usuários na tabela compras_usuarios
    FOR usuario IN 
        SELECT * FROM compras_usuarios
        WHERE status = 'ativo'  -- Apenas usuários ativos
    LOOP
        -- Verificar se o usuário já existe no sistema auth por email
        SELECT id INTO auth_user_id
        FROM auth.users
        WHERE email = usuario.email
        LIMIT 1;
        
        -- Se não encontrado, criar um novo usuário no sistema auth
        IF auth_user_id IS NULL THEN
            -- Verificar formato da senha (hash ou texto plano)
            IF usuario.senha IS NOT NULL AND usuario.senha LIKE '$2%' AND LENGTH(usuario.senha) > 50 THEN
                -- Não podemos migrar senha hash diretamente, gerar senha temporária
                INSERT INTO auth.users (
                    instance_id,
                    email,
                    email_confirmed_at,
                    encrypted_password,
                    raw_app_meta_data,
                    raw_user_meta_data,
                    created_at,
                    updated_at,
                    last_sign_in_at,
                    confirmation_token,
                    aud
                )
                VALUES (
                    (SELECT id FROM auth.instances LIMIT 1),
                    usuario.email,
                    NOW(),
                    crypt(gen_random_uuid()::TEXT, gen_salt('bf')),  -- Senha temporária, usuário precisará redefinir
                    '{"provider":"email","providers":["email"]}'::jsonb,
                    jsonb_build_object(
                        'name', usuario.nome,
                        'last_name', usuario.sobrenome,
                        'whatsapp', usuario.whatsapp,
                        'sector', usuario.setor,
                        'role', usuario.tipo_permissao,
                        'compras_user_id', usuario.id::TEXT,
                        'disabled', (usuario.status = 'inativo')
                    ),
                    COALESCE(usuario.data_criacao, NOW()),
                    NOW(),
                    usuario.ultimo_login,
                    NULL,
                    'authenticated'
                );
                
                -- Marcar este usuário para redefinição de senha
                UPDATE compras_usuarios
                SET precisa_redefinir_senha = TRUE
                WHERE id = usuario.id;
            ELSE
                -- Tentar migrar senha diretamente
                -- Nota: isso só funciona se a senha estiver em texto plano
                INSERT INTO auth.users (
                    instance_id,
                    email,
                    email_confirmed_at,
                    encrypted_password,
                    raw_app_meta_data,
                    raw_user_meta_data,
                    created_at,
                    updated_at,
                    last_sign_in_at,
                    confirmation_token,
                    aud
                )
                VALUES (
                    (SELECT id FROM auth.instances LIMIT 1),
                    usuario.email,
                    NOW(),
                    crypt(COALESCE(usuario.senha, gen_random_uuid()::TEXT), gen_salt('bf')),
                    '{"provider":"email","providers":["email"]}'::jsonb,
                    jsonb_build_object(
                        'name', usuario.nome,
                        'last_name', usuario.sobrenome,
                        'whatsapp', usuario.whatsapp,
                        'sector', usuario.setor,
                        'role', usuario.tipo_permissao,
                        'compras_user_id', usuario.id::TEXT,
                        'disabled', (usuario.status = 'inativo')
                    ),
                    COALESCE(usuario.data_criacao, NOW()),
                    NOW(),
                    usuario.ultimo_login,
                    NULL,
                    'authenticated'
                );
                
                -- Também marcar estes usuários para redefinição de senha por segurança
                UPDATE compras_usuarios
                SET precisa_redefinir_senha = TRUE
                WHERE id = usuario.id;
            END IF;
        ELSE
            -- Se o usuário já existe, apenas atualizar o metadata para vincular às tabelas
            UPDATE auth.users
            SET raw_user_meta_data = jsonb_build_object(
                'name', usuario.nome,
                'last_name', usuario.sobrenome,
                'whatsapp', usuario.whatsapp,
                'sector', usuario.setor,
                'role', usuario.tipo_permissao,
                'compras_user_id', usuario.id::TEXT,
                'disabled', (usuario.status = 'inativo')
            )
            WHERE id = auth_user_id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verificar se a coluna precisa_redefinir_senha existe e adicionar se necessário
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'compras_usuarios' 
        AND column_name = 'precisa_redefinir_senha'
    ) THEN
        ALTER TABLE compras_usuarios ADD COLUMN precisa_redefinir_senha BOOLEAN DEFAULT FALSE;
    END IF;
END
$$;

-- Executar a migração
SELECT migrate_existing_users_to_auth();

-- Comentar após execução para evitar rodá-la novamente
-- SELECT migrate_existing_users_to_auth(); 