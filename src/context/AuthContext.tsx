
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

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
  const fetchUsers = async () => {
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
  };

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchUsers();
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Query the compras_usuarios table for login
      const { data, error } = await supabase
        .from('compras_usuarios')
        .select('*')
        .eq('email', email)
        .eq('senha', password)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const loggedInUser: User = {
          id: data.id.toString(),
          email: data.email,
          name: data.nome,
          lastName: data.sobrenome,
          whatsapp: data.whatsapp,
          sector: data.setor,
          role: data.tipo_permissao as 'admin' | 'normal',
        };
        
        setUser(loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        
        // Update last login timestamp
        await supabase
          .from('compras_usuarios')
          .update({ ultimo_login: new Date().toISOString() })
          .eq('id', data.id);
          
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return false;
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

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const addUser = async (newUser: Omit<UserWithPassword, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('compras_usuarios')
        .insert({
          email: newUser.email,
          nome: newUser.name,
          sobrenome: newUser.lastName,
          senha: newUser.password,
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
      const { error } = await supabase
        .from('compras_usuarios')
        .update({
          email: updatedUser.email,
          nome: updatedUser.name,
          sobrenome: updatedUser.lastName,
          senha: updatedUser.password,
          whatsapp: updatedUser.whatsapp,
          setor: updatedUser.sector,
          tipo_permissao: updatedUser.role,
        })
        .eq('id', parseInt(updatedUser.id));

      if (error) throw error;

      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      
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
