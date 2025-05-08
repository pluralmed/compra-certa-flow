
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData, Status, Priority } from '@/context/data/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Package, 
  Plus, 
  Clock,
  List,
  KanbanSquare
} from 'lucide-react';
import { formatDate, getStatusEmoji, getStatusColor } from '@/utils/format';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const statusList: Status[] = [
  'Aguardando liberação',
  'Em cotação',
  'Aguardando pagamento',
  'Pagamento realizado',
  'Aguardando entrega',
  'Solicitação rejeitada'
];

// Dashboard will be our home page
const Dashboard = () => {
  const { user } = useAuth();
  const { requests, clients, units, updateRequestStatus } = useData();
  const navigate = useNavigate();
  const [view, setView] = useState<'kanban' | 'list'>(user.role === 'admin' ? 'kanban' : 'list');
  
  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  // Handle DnD end
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const requestId = active.id;
    const newStatus = over.id;
    
    if (newStatus) {
      updateRequestStatus(requestId, newStatus as Status);
    }
  };
  
  // Filter requests by user role
  const filteredRequests = user.role === 'admin' 
    ? requests 
    : requests.filter(req => req.userId === user.id);
  
  // Render the request card
  const RequestCard = ({ request }: { request: any }) => {
    const client = clients.find(c => c.id === request.clientId);
    const unit = units.find(u => u.id === request.unitId);
    
    return (
      <Card className="mb-3 card-hover">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-md">
              <span className="font-normal text-muted-foreground">#</span>{request.id}
            </CardTitle>
            <div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs text-white ${getStatusColor(request.status)}`}>
                {getStatusEmoji(request.status)} {request.status}
              </span>
            </div>
          </div>
          <CardDescription className="flex justify-between">
            <span>{formatDate(request.createdAt)}</span>
            <span>{request.type}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-sm">
            <p><strong>Cliente:</strong> {client?.name}</p>
            <p><strong>Unidade:</strong> {unit?.name}</p>
            <p>
              <strong>Prioridade:</strong> 
              <span className={`inline-block w-3 h-3 rounded-full ${
                request.priority === 'Média' ? 'bg-blue-500' : 
                request.priority === 'Alta' ? 'bg-yellow-500' : 
                request.priority === 'Baixa' ? 'bg-green-500' :
                request.priority === 'Moderada' ? 'bg-orange-500' :
                'bg-red-500'
              } mr-1`}></span> {request.priority}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline"
            size="sm" 
            className="w-full"
            onClick={() => navigate(`/solicitacao/${request.id}`)}
          >
            Ver detalhes
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  // Admin Kanban view
  const KanbanView = () => (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statusList.map(status => (
          <div key={status} className="flex flex-col h-full">
            <div className="flex items-center mb-3 bg-white p-2 rounded-lg shadow">
              <span className="status-emoji">{getStatusEmoji(status)}</span>
              <h3 className="font-medium text-sm">{status}</h3>
              <span className="ml-auto bg-gray-100 text-gray-700 rounded-full h-6 w-6 flex items-center justify-center text-xs">
                {requests.filter(r => r.status === status).length}
              </span>
            </div>
            
            <div 
              id={status}
              className="bg-muted/50 p-2 rounded-lg flex-1 overflow-y-auto min-h-[300px]"
            >
              <SortableContext 
                items={requests.filter(r => r.status === status).map(r => r.id)}
                strategy={verticalListSortingStrategy}
              >
                {requests
                  .filter(r => r.status === status)
                  .map(request => (
                    <div key={request.id} id={request.id} className="mb-2">
                      <RequestCard request={request} />
                    </div>
                  ))
                }
              </SortableContext>
            </div>
          </div>
        ))}
      </div>
    </DndContext>
  );
  
  // List view for all users
  const ListView = () => (
    <div className="space-y-4">
      {/* Filters here in the future */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-medium text-gray-500 border-b">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Data</th>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Tipo</th>
                <th className="px-4 py-3 text-left">Prioridade</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map(request => {
                const client = clients.find(c => c.id === request.clientId);
                return (
                  <tr key={request.id} className="text-sm border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">#{request.id}</td>
                    <td className="px-4 py-3">{formatDate(request.createdAt)}</td>
                    <td className="px-4 py-3">{client?.name}</td>
                    <td className="px-4 py-3">{request.type}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block w-2 h-2 rounded-full ${
                        request.priority === 'Média' ? 'bg-blue-500' : 
                        request.priority === 'Alta' ? 'bg-yellow-500' : 
                        request.priority === 'Baixa' ? 'bg-green-500' :
                        request.priority === 'Moderada' ? 'bg-orange-500' :
                        'bg-red-500'
                      } mr-1`}></span>
                      {request.priority}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs text-white ${getStatusColor(request.status)}`}>
                        {getStatusEmoji(request.status)} {request.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/solicitacao/${request.id}`)}
                      >
                        Ver
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Nenhuma solicitação encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {user.role === 'admin' ? 'Gerenciar Solicitações' : 'Minhas Solicitações'}
          </h2>
          <p className="text-muted-foreground">
            {user.role === 'admin' 
              ? 'Visualize e gerencie todas as solicitações do sistema'
              : 'Visualize e acompanhe suas solicitações'
            }
          </p>
        </div>
        <div className="flex gap-2">
          {user.role === 'admin' && (
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
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Requests */}
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package size={16} className="text-teal" />
              Total de Solicitações
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold">
              {filteredRequests.length}
            </div>
          </CardContent>
        </Card>
        
        {/* Pending Requests */}
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock size={16} className="text-amber-500" />
              Aguardando Liberação
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold">
              {filteredRequests.filter(r => r.status === 'Aguardando liberação').length}
            </div>
          </CardContent>
        </Card>
        
        {/* In Progress */}
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package size={16} className="text-blue" />
              Em Processamento
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold">
              {filteredRequests.filter(r => 
                ['Em cotação', 'Aguardando pagamento', 'Pagamento realizado', 'Aguardando entrega'].includes(r.status)
              ).length}
            </div>
          </CardContent>
        </Card>
        
        {/* Completed */}
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package size={16} className="text-green-500" />
              Entregues
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold">
              {filteredRequests.filter(r => r.status === 'Pagamento realizado').length}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <div>
        {user.role === 'admin' && view === 'kanban' ? <KanbanView /> : <ListView />}
      </div>
    </div>
  );
};

export default Dashboard;
