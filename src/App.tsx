import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/data/DataContext";
import AppLayout from "./components/layout/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import Settings from "./pages/Settings";
import NewRequest from "./pages/NewRequest";
import RequestDetails from "./pages/RequestDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Componente para proteger rotas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  // Se ainda estiver carregando, não fazer nada
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }
  
  // Se não tiver usuário, redirecionar para login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Se tiver usuário, renderizar as rotas protegidas
  return <>{children}</>;
};

// Componente para redirecionar quando já estiver logado
const RedirectIfLoggedIn = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  // Se ainda estiver carregando, não fazer nada
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }
  
  // Se já estiver logado, redirecionar para dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  // Se não estiver logado, renderizar a página de login
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<RedirectIfLoggedIn><Login /></RedirectIfLoggedIn>} />
      <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="usuarios" element={<UserManagement />} />
        <Route path="configuracoes" element={<Settings />} />
        <Route path="nova-solicitacao" element={<NewRequest />} />
        <Route path="solicitacao/:id" element={<RequestDetails />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <AppRoutes />
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
