import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import * as bcrypt from 'bcryptjs';

interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  whatsapp: string;
  sector: string;
  role: 'admin' | 'normal';
  status: 'ativo' | 'inativo';
}

// Creating a type that includes password for internal use
interface UserWithPassword extends User {
  password: string;
}

interface AuthContextProps {
  user: User | null;
  users: User[];
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (user: Omit<UserWithPassword, 'id'>) => Promise<boolean>;
  updateUser: (user: UserWithPassword) => Promise<boolean>;
  toggleUserStatus: (id: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch users from Supabase
  const fetchUsers = useCallback(async () => {
    try {
      // Buscar usuários da tabela compras_usuarios
      const { data, error } = await supabase
        .from('compras_usuarios')
        .select('*');

      if (error) throw error;

      // Transform database users to our User interface
      if (data) {
        const transformedUsers: User[] = data.map(dbUser => ({
          id: dbUser.id.toString(),
          email: dbUser.email,
          name: dbUser.nome,
          lastName: dbUser.sobrenome,
          whatsapp: dbUser.whatsapp,
          sector: dbUser.setor,
          role: dbUser.tipo_permissao as 'admin' | 'normal',
          status: (dbUser.status || 'ativo') as 'ativo' | 'inativo',
        }));
        setUsers(transformedUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os usuários.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Verificar sessão atual do Supabase Auth
  const checkCurrentSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (session) {
        // Usuário está autenticado no Supabase Auth
        // Buscar dados complementares da tabela compras_usuarios
        const { data, error: userError } = await supabase
          .from('compras_usuarios')
          .select('*')
          .eq('email', session.user.email)
          .single();
          
        if (userError) throw userError;
        
        if (data) {
          const loggedInUser: User = {
            id: data.id.toString(),
            email: data.email,
            name: data.nome,
            lastName: data.sobrenome,
            whatsapp: data.whatsapp,
            sector: data.setor,
            role: data.tipo_permissao as 'admin' | 'normal',
            status: (data.status || 'ativo') as 'ativo' | 'inativo',
          };
          
          setUser(loggedInUser);
          localStorage.setItem('user', JSON.stringify(loggedInUser));
        }
      } else {
        // Verificar localStorage como fallback para compatibilidade
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch (e) {
            console.error("Erro ao analisar dados do usuário do localStorage:", e);
            localStorage.removeItem('user');
          }
        }
      }
    } catch (error) {
      console.error("Erro ao verificar sessão:", error);
      // Limpar dados locais se houver erro de sessão
      localStorage.removeItem('user');
      setUser(null);
    }
  }, []);

  // Check if user is logged in on mount
  useEffect(() => {
    // Verificar sessão atual e buscar usuários
    checkCurrentSession()
      .then(() => fetchUsers())
      .finally(() => setLoading(false));
  }, [checkCurrentSession, fetchUsers]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // 1. Tentar login pelo Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) {
        // Se não conseguir autenticar pelo auth nativo, tente pelo método legado
        // Buscar usuário por email na tabela compras_usuarios
        const { data: userData, error: userError } = await supabase
          .from('compras_usuarios')
          .select('*')
          .eq('email', email)
          .single();
            
        if (userError) {
          throw new Error("Usuário não encontrado");
        }
        
        // Verificar se a conta está inativa
        if (userData.status === 'inativo') {
          throw new Error("Usuário inativo");
        }
        
        // Verificar senha com bcrypt
        const isPasswordHashed = userData.senha.startsWith('$2') && userData.senha.length > 50;
        
        let passwordMatches = false;
        
        if (isPasswordHashed) {
          passwordMatches = await bcrypt.compare(password, userData.senha);
        } else {
          passwordMatches = password === userData.senha;
          
          // Atualizar para hash se a senha estiver em texto plano
          if (passwordMatches) {
            const hashedPassword = await bcrypt.hash(password, 10);
            
            await supabase
              .from('compras_usuarios')
              .update({ senha: hashedPassword })
              .eq('id', userData.id);
          }
        }
        
        if (!passwordMatches) {
          throw new Error("Senha incorreta");
        }
        
        // Se a autenticação legada foi bem-sucedida, crie um usuário no sistema de auth
        // e vincule com o usuário existente
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              compras_user_id: userData.id.toString()
            }
          }
        });
        
        if (signUpError) {
          console.warn("Não foi possível criar usuário no sistema de auth:", signUpError);
        }
        
        // Login bem-sucedido via método legado
        const loggedInUser: User = {
          id: userData.id.toString(),
          email: userData.email,
          name: userData.nome,
          lastName: userData.sobrenome,
          whatsapp: userData.whatsapp,
          sector: userData.setor,
          role: userData.tipo_permissao as 'admin' | 'normal',
          status: (userData.status || 'ativo') as 'ativo' | 'inativo',
        };
        
        setUser(loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        
        // Update last login timestamp
        await supabase
          .from('compras_usuarios')
          .update({ ultimo_login: new Date().toISOString() })
          .eq('id', userData.id);
      } else {
        // Login via Supabase Auth bem-sucedido
        // Buscar dados complementares da tabela compras_usuarios
        const { data: userData, error: userError } = await supabase
          .from('compras_usuarios')
          .select('*')
          .eq('email', email)
          .single();
        
        if (userError) {
          // Este usuário existe no auth mas não na tabela compras_usuarios
          // Isso não deveria acontecer, mas se acontecer, fazer logout
          await supabase.auth.signOut();
          throw new Error("Usuário não encontrado no sistema interno");
        }
        
        // Verificar se a conta está inativa
        if (userData.status === 'inativo') {
          await supabase.auth.signOut();
          throw new Error("Usuário inativo");
        }
        
        // Login bem-sucedido via Supabase Auth
        const loggedInUser: User = {
          id: userData.id.toString(),
          email: userData.email,
          name: userData.nome,
          lastName: userData.sobrenome,
          whatsapp: userData.whatsapp,
          sector: userData.setor,
          role: userData.tipo_permissao as 'admin' | 'normal',
          status: (userData.status || 'ativo') as 'ativo' | 'inativo',
        };
        
        setUser(loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        
        // Update last login timestamp
        await supabase
          .from('compras_usuarios')
          .update({ ultimo_login: new Date().toISOString() })
          .eq('id', userData.id);
      }
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : "Email ou senha incorretos";
      
      toast({
        title: "Erro de login",
        description: errorMessage === "Usuário inativo" 
          ? "Esta conta foi desativada. Entre em contato com o administrador." 
          : "Email ou senha incorretos.",
        variant: "destructive",
      });
      
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Fazer logout do Supabase Auth
      await supabase.auth.signOut();
      
      // Limpar dados locais
      setUser(null);
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Mesmo com erro, limpar dados locais
      setUser(null);
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const addUser = async (newUser: Omit<UserWithPassword, 'id'>): Promise<boolean> => {
    try {
      // Hash da senha para a tabela compras_usuarios
      const hashedPassword = await bcrypt.hash(newUser.password, 10);
      
      // Criar primeiro na tabela compras_usuarios
      const { data, error } = await supabase
        .from('compras_usuarios')
        .insert({
          email: newUser.email,
          nome: newUser.name,
          sobrenome: newUser.lastName,
          senha: hashedPassword,
          whatsapp: newUser.whatsapp,
          setor: newUser.sector,
          tipo_permissao: newUser.role,
          status: newUser.status || 'ativo',
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        // Tentar agora criar o usuário no sistema de auth do Supabase
        const { error: signUpError } = await supabase.auth.signUp({
          email: newUser.email,
          password: newUser.password,
          options: {
            data: {
              name: newUser.name,
              last_name: newUser.lastName,
              compras_user_id: data.id.toString()
            }
          }
        });
        
        if (signUpError) {
          console.warn("Não foi possível criar usuário no sistema de auth:", signUpError);
          // Continuar mesmo se falhar no auth, pois o usuário já foi criado na tabela compras_usuarios
        }

        const userWithId: User = {
          id: data.id.toString(),
          email: data.email,
          name: data.nome,
          lastName: data.sobrenome,
          whatsapp: data.whatsapp,
          sector: data.setor,
          role: data.tipo_permissao as 'admin' | 'normal',
          status: data.status as 'ativo' | 'inativo',
        };
        
        setUsers([...users, userWithId]);
        
        toast({
          title: "Usuário criado",
          description: `${newUser.name} ${newUser.lastName} foi adicionado com sucesso.`,
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o usuário.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateUser = async (updatedUser: UserWithPassword): Promise<boolean> => {
    try {
      // Hash da senha se foi alterada
      let hashedPassword;
      const passwordChanged = updatedUser.password && updatedUser.password.length > 0;
      
      if (passwordChanged) {
        hashedPassword = await bcrypt.hash(updatedUser.password, 10);
      }
      
      // Atualizar na tabela compras_usuarios
      const { error } = await supabase
        .from('compras_usuarios')
        .update({
          email: updatedUser.email,
          nome: updatedUser.name,
          sobrenome: updatedUser.lastName,
          ...(passwordChanged && { senha: hashedPassword }),
          whatsapp: updatedUser.whatsapp,
          setor: updatedUser.sector,
          tipo_permissao: updatedUser.role,
          status: updatedUser.status,
        })
        .eq('id', parseInt(updatedUser.id));

      if (error) throw error;

      // Atualizar o estado local
      const updatedUserWithoutPassword: User = {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        lastName: updatedUser.lastName,
        whatsapp: updatedUser.whatsapp,
        sector: updatedUser.sector,
        role: updatedUser.role,
        status: updatedUser.status,
      };
      
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUserWithoutPassword : u));
      
      // Se a senha foi alterada, enviar email para redefinição de senha
      if (passwordChanged) {
        try {
          await supabase.auth.resetPasswordForEmail(updatedUser.email).catch(e => {
            console.warn("Não foi possível enviar email de redefinição de senha:", e);
          });
        } catch (e) {
          console.warn("Erro ao tentar enviar email para redefinição de senha:", e);
        }
      }
      
      toast({
        title: "Usuário atualizado",
        description: `${updatedUser.name} ${updatedUser.lastName} foi atualizado com sucesso.`,
      });
      
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o usuário.",
        variant: "destructive",
      });
      return false;
    }
  };

  const toggleUserStatus = async (id: string): Promise<boolean> => {
    try {
      const userToToggle = users.find(u => u.id === id);
      if (!userToToggle) return false;
      
      // Alternar o status
      const newStatus = userToToggle.status === 'ativo' ? 'inativo' : 'ativo';
      
      // Atualizar na tabela compras_usuarios
      const { error } = await supabase
        .from('compras_usuarios')
        .update({ status: newStatus })
        .eq('id', parseInt(id));

      if (error) throw error;
      
      // Se o usuário for inativado, desabilitar no auth do Supabase
      if (newStatus === 'inativo') {
        await supabase.auth.admin.updateUserById(id, {
          user_metadata: { disabled: true }
        }).catch(e => {
          console.warn("Não foi possível desabilitar usuário no auth:", e);
        });
      } else {
        // Se o usuário for reativado, reabilitar no auth do Supabase
        await supabase.auth.admin.updateUserById(id, {
          user_metadata: { disabled: false }
        }).catch(e => {
          console.warn("Não foi possível reabilitar usuário no auth:", e);
        });
      }

      // Atualizar o estado local
      setUsers(users.map(u => u.id === id ? { ...u, status: newStatus as 'ativo' | 'inativo' } : u));
      
      toast({
        title: newStatus === 'ativo' ? "Usuário ativado" : "Usuário inativado",
        description: `${userToToggle.name} ${userToToggle.lastName} foi ${newStatus === 'ativo' ? 'ativado' : 'inativado'} com sucesso.`,
      });
      
      return true;
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status do usuário.",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      users,
      loading,
      login,
      logout,
      addUser,
      updateUser,
      toggleUserStatus,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
