
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        navigate('/');
      } else {
        toast({
          title: "Erro ao entrar",
          description: "Email ou senha incorretos.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao entrar",
        description: "Ocorreu um erro ao processar a sua solicitação.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-light-gray p-4">
      <div 
        className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden animate-scale-in"
      >
        <div className="p-8">
          <div className="flex flex-col items-center justify-center mb-8">
            <Logo />
            <h2 className="mt-6 text-2xl font-bold text-center">
              Sistema de Solicitações de Compras
            </h2>
            <p className="mt-2 text-center text-muted-foreground">
              Entre com suas credenciais para acessar o sistema
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus-visible:ring-teal"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="focus-visible:ring-teal"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-teal hover:bg-teal/90"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Credenciais de teste:</p>
            <div className="text-sm mt-2 font-mono bg-slate-50 p-2 rounded">
              <p>Admin: admin@exemplo.com / admin123</p>
              <p>Usuário: usuario@exemplo.com / user123</p>
            </div>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-center text-slate-500">
        © {new Date().getFullYear()} Sistema Interno de Solicitações
      </p>
    </div>
  );
};

export default Login;
