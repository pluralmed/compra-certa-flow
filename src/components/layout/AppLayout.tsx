
import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Package, 
  Users, 
  Settings, 
  List, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from 'react-router-dom';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

const SidebarLink = ({ to, icon, children, onClick }: SidebarLinkProps) => {
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
      <span className="text-base font-medium">{children}</span>
    </Link>
  );
};

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  const closeSidebar = () => {
    setSidebarOpen(false);
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
          "fixed md:relative z-40 h-full bg-sidebar w-64 transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4">
            <Logo className="text-sidebar-foreground" />
          </div>
          
          <nav className="flex-1 mt-6 px-2 space-y-1">
            <SidebarLink to="/" icon={<Package size={20} />} onClick={closeSidebar}>
              Solicitações
            </SidebarLink>
            
            {user.role === 'admin' && (
              <>
                <SidebarLink to="/usuarios" icon={<Users size={20} />} onClick={closeSidebar}>
                  Usuários
                </SidebarLink>
                <SidebarLink to="/configuracoes" icon={<Settings size={20} />} onClick={closeSidebar}>
                  Configurações
                </SidebarLink>
              </>
            )}
            
            <SidebarLink to="/minhas-solicitacoes" icon={<List size={20} />} onClick={closeSidebar}>
              Minhas Solicitações
            </SidebarLink>
          </nav>
          
          <div className="p-4 mt-auto">
            <Button 
              variant="outline" 
              className="w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 border-sidebar-border"
              onClick={() => {
                closeSidebar();
                logout();
              }}
            >
              <LogOut size={18} className="mr-2" />
              Sair
            </Button>
          </div>
        </div>
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
                {location.pathname === '/minhas-solicitacoes' && 'Minhas Solicitações'}
                {location.pathname === '/nova-solicitacao' && 'Nova Solicitação'}
              </h1>
            </div>
            
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <span className="h-8 w-8 rounded-full bg-teal text-white grid place-items-center">
                      {user.name.charAt(0) + user.lastName.charAt(0)}
                    </span>
                    <span className="hidden md:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <span className="font-medium">{user.name} {user.lastName}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span className="text-muted-foreground">{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span className="text-muted-foreground">{user.sector}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut size={16} className="mr-2" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
