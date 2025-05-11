import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Package, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  collapsed?: boolean;
}

const SidebarLink = ({ to, icon, children, onClick, collapsed }: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
        isActive 
          ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
          : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
      )}
      onClick={onClick}
    >
      {icon}
      {!collapsed && <span className="text-base font-medium">{children}</span>}
    </Link>
  );
};

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  
  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  return (
    <div className="flex h-screen w-full bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={closeSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed md:relative z-40 h-full bg-sidebar transition-all duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          <div className={cn("p-4", sidebarCollapsed && "flex justify-center")}>
            {sidebarCollapsed ? (
              <span className="text-3xl">🛒</span>
            ) : (
              <>
                <Logo className="text-sidebar-foreground" />
                <h2 className="mt-2 font-bold text-lg text-sidebar-foreground">Compras - PluralMed</h2>
              </>
            )}
          </div>
          
          <nav className="flex-1 mt-6 px-2 space-y-1">
            <SidebarLink to="/" icon={<Package size={20} />} onClick={closeSidebar} collapsed={sidebarCollapsed}>
              Solicitações
            </SidebarLink>
            
            {user.role === 'admin' && (
              <>
                <SidebarLink to="/usuarios" icon={<Users size={20} />} onClick={closeSidebar} collapsed={sidebarCollapsed}>
                  Usuários
                </SidebarLink>
                <SidebarLink to="/configuracoes" icon={<Settings size={20} />} onClick={closeSidebar} collapsed={sidebarCollapsed}>
                  Configurações
                </SidebarLink>
              </>
            )}
          </nav>
        </div>

        {/* Toggle sidebar button */}
        <button 
          onClick={toggleSidebar}
          className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md p-1 border border-gray-200 hover:bg-gray-50"
          aria-label={sidebarCollapsed ? "Expandir menu" : "Retrair menu"}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white border-b h-16 flex items-center px-4 sticky top-0 z-10">
          <div className="flex justify-between items-center w-full">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
            
            <div className="md:flex-1">
              <h1 className="text-lg font-medium md:ml-4">
                {location.pathname === '/' && 'Dashboard'}
                {location.pathname === '/usuarios' && 'Gerenciamento de Usuários'}
                {location.pathname === '/configuracoes' && 'Configurações do Sistema'}
                {location.pathname === '/nova-solicitacao' && 'Nova Solicitação'}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <User size={20} className="text-gray-500" />
                <span className="font-medium">{user.name} {user.lastName}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={logout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut size={16} className="mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
