# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/b50b5a6b-55b5-4beb-a60d-ad4afca70941

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/b50b5a6b-55b5-4beb-a60d-ad4afca70941) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Configuração do Supabase Auth e Tabela Personalizada

Este projeto utiliza o Supabase Auth integrado com uma tabela personalizada `compras_usuarios`. Para que a integração funcione corretamente, siga os passos abaixo:

### 1. Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-do-supabase
```

### 2. Execução das Migrações do Supabase

Execute as migrações SQL no painel de administração do Supabase para configurar os triggers que mantêm as tabelas sincronizadas:

1. Navegue até a pasta `supabase/migrations`
2. Execute os scripts SQL na interface do Supabase SQL Editor na seguinte ordem:
   - `20240801000000_sync_auth_users_with_compras_usuarios.sql` (configura os triggers)
   - `20240801000001_migrate_existing_users.sql` (migra usuários existentes)

### 3. Resumo da Integração

- Ao criar um usuário através da interface da aplicação, ele será registrado tanto na tabela `auth.users` quanto em `compras_usuarios`
- Ao fazer login, o sistema tentará autenticar pelo Supabase Auth, com fallback para o método legado
- Os status dos usuários (ativo/inativo) são sincronizados entre as tabelas
- As senhas são armazenadas de forma segura usando hash bcrypt

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Autenticação e Banco de Dados)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/b50b5a6b-55b5-4beb-a60d-ad4afca70941) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
