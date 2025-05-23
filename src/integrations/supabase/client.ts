// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Obter as URLs do Supabase das variáveis de ambiente (vite)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://uzczytoqldivhexwakal.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6Y3p5dG9xbGRpdmhleHdha2FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNDE5NTYsImV4cCI6MjA2MTcxNzk1Nn0.4UcYdDXGKJG6zd_ptWRuTHhv4F5r46k-Z4bUdfT6LUc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  }
});

// Helper para verificar se a sessão auth atual é válida
export const getValidSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Erro ao obter sessão:', error);
    return null;
  }
  return data.session;
};

// Helper para obter o ID do usuário compras_usuarios vinculado
export const getComprasUserId = async () => {
  const session = await getValidSession();
  if (!session) return null;
  
  // Buscar do metadata do usuário
  const comprasUserId = session.user.user_metadata?.compras_user_id;
  if (comprasUserId) return comprasUserId;
  
  // Se não estiver no metadata, buscar na tabela compras_usuarios
  const { data, error } = await supabase
    .from('compras_usuarios')
    .select('id')
    .eq('email', session.user.email)
    .single();
    
  if (error || !data) return null;
  return data.id.toString();
};
