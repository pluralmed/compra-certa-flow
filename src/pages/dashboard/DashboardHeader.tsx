import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { List, KanbanSquare, Plus } from 'lucide-react';

interface DashboardHeaderProps {
  userRole: string;
  view: 'kanban' | 'list';
  setView: (view: 'kanban' | 'list') => void;
}

const DashboardHeader = ({ userRole, view, setView }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold">
          {userRole === 'admin' ? 'Gerenciar Solicitações' : 'Minhas Solicitações'}
        </h2>
        <p className="text-muted-foreground">
          {userRole === 'admin' 
            ? 'Visualize e gerencie todas as solicitações do sistema'
            : 'Visualize e acompanhe suas solicitações'
          }
        </p>
      </div>
      <div className="flex gap-2">
        {userRole === 'admin' && (
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={view === 'kanban' ? 'default' : 'ghost'}
              className="w-10 h-10 p-0"
              onClick={() => setView('kanban')}
            >
              <KanbanSquare size={20} />
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'ghost'}
              className="w-10 h-10 p-0"
              onClick={() => setView('list')}
            >
              <List size={20} />
            </Button>
          </div>
        )}
        
        <Button onClick={() => navigate('/nova-solicitacao')} className="bg-teal hover:bg-teal/90">
          <Plus size={16} className="mr-2" />
          Nova Solicitação
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader; 