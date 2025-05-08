
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Mock user data - In a real app, this would come from an API
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@exemplo.com',
    password: 'admin123',
    name: 'Admin',
    lastName: 'Sistema',
    whatsapp: '(11) 9 9999-9999',
    sector: 'Tecnologia',
    role: 'admin'
  },
  {
    id: '2',
    email: 'usuario@exemplo.com',
    password: 'user123',
    name: 'Usuário',
    lastName: 'Padrão',
    whatsapp: '(11) 9 8888-8888',
    sector: 'Engenharia Civil',
    role: 'normal'
  }
];

interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  whatsapp: string;
  sector: string;
  role: 'admin' | 'normal';
}

interface AuthContextProps {
  user: User | null;
  users: User[];
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // In a real app, this would be an API call
    const foundUser = MOCK_USERS.find(
      u => u.email === email && u.password === password
    );
    
    if (foundUser) {
      // Remove password from user object
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword as User);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const addUser = (newUser: Omit<User, 'id'>) => {
    const id = (users.length + 1).toString();
    const userWithId = { ...newUser, id };
    setUsers([...users, userWithId]);
    toast({
      title: "Usuário criado",
      description: `${newUser.name} ${newUser.lastName} foi adicionado com sucesso.`,
    });
  };

  const updateUser = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    toast({
      title: "Usuário atualizado",
      description: `${updatedUser.name} ${updatedUser.lastName} foi atualizado com sucesso.`,
    });
  };

  const deleteUser = (id: string) => {
    const userToDelete = users.find(u => u.id === id);
    setUsers(users.filter(u => u.id !== id));
    if (userToDelete) {
      toast({
        title: "Usuário removido",
        description: `${userToDelete.name} ${userToDelete.lastName} foi removido com sucesso.`,
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
