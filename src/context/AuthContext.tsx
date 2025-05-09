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
  addUser: (user: Omit<UserWithPassword, 'id'>) => void;
  updateUser: (user: UserWithPassword) => void;
  deleteUser: (id: string) => void;
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

  // Check if user is logged in on mount
  useEffect(() => {
    // Verificar se há dados do usuário no localStorage
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
    
    // Buscar todos os usuários e finalizar carregamento
    fetchUsers().finally(() => setLoading(false));
  }, [fetchUsers]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Buscar usuário por email
      const { data: userData, error: userError } = await supabase
        .from('compras_usuarios')
        .select('*')
        .eq('email', email)
        .single();
          
      if (userError) {
        throw new Error("Usuário não encontrado");
      }
      
      // Verificar se a senha armazenada está em formato hash
      const isPasswordHashed = userData.senha.startsWith('$2') && userData.senha.length > 50;
      
      // Se a senha estiver em hash, verificar com bcrypt
      // Se não, comparar diretamente (legado)
      let passwordMatches = false;
      
      if (isPasswordHashed) {
        passwordMatches = await bcrypt.compare(password, userData.senha);
      } else {
        passwordMatches = password === userData.senha;
        
        // Atualizar para hash se a senha estiver em texto plano
        if (passwordMatches) {
          const hashedPassword = await bcrypt.hash(password, 10);
          
          // Atualizar a senha para o formato hash
          await supabase
            .from('compras_usuarios')
            .update({ senha: hashedPassword })
            .eq('id', userData.id);
        }
      }
      
      if (!passwordMatches) {
        throw new Error("Senha incorreta");
      }
      
      // Login bem-sucedido
      const loggedInUser: User = {
        id: userData.id.toString(),
        email: userData.email,
        name: userData.nome,
        lastName: userData.sobrenome,
        whatsapp: userData.whatsapp,
        sector: userData.setor,
        role: userData.tipo_permissao as 'admin' | 'normal',
      };
      
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      
      // Update last login timestamp
      await supabase
        .from('compras_usuarios')
        .update({ ultimo_login: new Date().toISOString() })
        .eq('id', userData.id);
        
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erro de login",
        description: "Email ou senha incorretos.",
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    // Limpar dados locais
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const addUser = async (newUser: Omit<UserWithPassword, 'id'>) => {
    try {
      // Hash da senha antes de armazenar
      const hashedPassword = await bcrypt.hash(newUser.password, 10);
      
      // Criar o usuário na tabela compras_usuarios
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
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const userWithId: User = {
          id: data.id.toString(),
          email: data.email,
          name: data.nome,
          lastName: data.sobrenome,
          whatsapp: data.whatsapp,
          sector: data.setor,
          role: data.tipo_permissao as 'admin' | 'normal',
        };
        
        setUsers([...users, userWithId]);
        
        toast({
          title: "Usuário criado",
          description: `${newUser.name} ${newUser.lastName} foi adicionado com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o usuário.",
        variant: "destructive",
      });
    }
  };

  const updateUser = async (updatedUser: UserWithPassword) => {
    try {
      // Se a senha foi alterada, fazer hash
      let hashedPassword;
      
      // Verificar se a senha foi alterada comparando com o usuário atual
      const currentUser = users.find(u => u.id === updatedUser.id);
      const passwordChanged = !currentUser || 'password' in updatedUser;
      
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
      };
      
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUserWithoutPassword : u));
      
      toast({
        title: "Usuário atualizado",
        description: `${updatedUser.name} ${updatedUser.lastName} foi atualizado com sucesso.`,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o usuário.",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const userToDelete = users.find(u => u.id === id);
      
      // Excluir da tabela compras_usuarios
      const { error } = await supabase
        .from('compras_usuarios')
        .delete()
        .eq('id', parseInt(id));

      if (error) throw error;

      setUsers(users.filter(u => u.id !== id));
      
      if (userToDelete) {
        toast({
          title: "Usuário removido",
          description: `${userToDelete.name} ${userToDelete.lastName} foi removido com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o usuário.",
        variant: "destructive",
      });
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
      deleteUser,
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
