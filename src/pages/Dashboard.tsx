import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/data/DataContext';
import { Status, Priority } from '@/context/data/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Package, 
  Plus, 
  Clock,
  List,
  KanbanSquare,
  CalendarIcon,
  Search,
  X,
  Filter
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusEmoji, getStatusColor, getPriorityColor, formatRequestType } from '@/utils/format';
import { format, isAfter, isBefore, parseISO, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from "react-day-picker";

const statusList: Status[] = [
  'Aguardando liberação',
  'Em cotação',
  'Aguardando pagamento',
  'Pagamento realizado',
  'Aguardando entrega',
  'Entregue',
  'Solicitação rejeitada'
];

const priorityList: Priority[] = [
  'Moderado',
  'Urgente',
  'Emergencial'
];

// Dashboard will be our home page
const Dashboard = () => {
  const { user, users } = useAuth();
  const { requests, clients, units, updateRequestStatus } = useData();
  const navigate = useNavigate();
  const [view, setView] = useState<'kanban' | 'list'>(user.role === 'admin' ? 'kanban' : 'list');
  
  // Filtros
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  // Obter usuários que realizaram solicitações
  const usersWithRequests = useMemo(() => {
    // Obter IDs únicos dos usuários que fizeram solicitações
    const userIds = [...new Set(requests.map(request => request.userId))];
    
    // Filtrar a lista de usuários para incluir apenas aqueles que fizeram solicitações
    return users.filter(user => userIds.includes(user.id));
  }, [requests, users]);
  
  // Limpar filtros
  const clearFilters = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setUserFilter('all');
    setDateRange(undefined);
  };
  
  // Filter requests by user role and filters
  const filteredRequests = useMemo(() => {
    // Primeiro filtrar por papel do usuário
    let filtered = user.role === 'admin' 
      ? requests 
      : requests.filter(req => req.userId === user.id);
    
    // Filtrar por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter);
    }
    
    // Filtrar por prioridade
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(req => req.priority === priorityFilter);
    }
    
    // Filtrar por usuário (apenas para admin)
    if (user.role === 'admin' && userFilter !== 'all') {
      filtered = filtered.filter(req => req.userId === userFilter);
    }
    
    // Filtrar por data
    if (dateRange?.from) {
      const fromDate = startOfDay(dateRange.from);
      filtered = filtered.filter(req => {
        const requestDate = parseISO(req.createdAt);
        return isAfter(requestDate, fromDate) || requestDate.getTime() === fromDate.getTime();
      });
    }
    
    if (dateRange?.to) {
      const toDate = endOfDay(dateRange.to);
      filtered = filtered.filter(req => {
        const requestDate = parseISO(req.createdAt);
        return isBefore(requestDate, toDate) || requestDate.getTime() === toDate.getTime();
      });
    }
    
    return filtered;
  }, [requests, user, statusFilter, priorityFilter, userFilter, dateRange]);
  
  // Componente simples para o cartão
  const RequestCard = ({ request }: { request: any }) => {
    const client = clients.find(c => c.id === request.clientId);
    const unit = units.find(u => u.id === request.unitId);
    const requestCreator = users.find(u => u.id === request.userId);
    
    return (
      <Card className="mb-3 card-hover">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-md">
              <span className="font-normal text-muted-foreground">#</span>{request.id}
            </CardTitle>
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                {requestCreator ? `${requestCreator.name} ${requestCreator.lastName}` : 'Usuário'}
              </span>
            </div>
          </div>
          <CardDescription>
            {formatDate(request.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-sm">
            <p><strong>Cliente:</strong> {client?.name}</p>
            <p><strong>Unidade:</strong> {unit?.name}</p>
            <p>
              <strong>Prioridade:</strong> 
              <span className={`inline-block w-3 h-3 rounded-full ${
                request.priority === 'Moderado' ? 'bg-blue-500' : 
                request.priority === 'Urgente' ? 'bg-orange-500' :
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
  const KanbanView = () => {
    // Função para lidar com o drag and drop HTML5 nativo
    const handleDragStart = (e: React.DragEvent, requestId: string) => {
      // Armazenar o ID da solicitação sendo arrastada
      e.dataTransfer.setData("text/plain", requestId);
      e.dataTransfer.effectAllowed = "move";
    };
    
    const handleDrop = (e: React.DragEvent, newStatus: Status) => {
      e.preventDefault();
      
      // Obter o ID da solicitação que está sendo arrastada
      const requestId = e.dataTransfer.getData("text/plain");
      console.log(`Tentando soltar solicitação ${requestId} no status ${newStatus}`);
      
      // Encontrar a solicitação
      const request = filteredRequests.find(r => r.id === requestId);
      
      if (!request) {
        console.error(`Solicitação ${requestId} não encontrada`);
        return;
      }
      
      console.log(`Status atual da solicitação: ${request.status}`);
      
      // Só atualizar se o status for diferente
      if (request.status !== newStatus) {
        console.log(`Movendo solicitação ${requestId} para status ${newStatus}`);
        updateRequestStatus(requestId, newStatus, user.id);
      } else {
        console.log(`Solicitação já está no status ${newStatus}, nenhuma ação necessária`);
      }
    };
    
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    };
    
    return (
      <div className="grid grid-cols-7 gap-4 overflow-x-auto pb-4">
        {statusList.map(status => (
          <div key={status} className="flex flex-col h-full min-w-[200px]">
            <div className="flex items-center mb-3 bg-white p-2 rounded-lg shadow">
              <span className="status-emoji mr-2">{getStatusEmoji(status)}</span>
              <h3 className="font-medium text-sm">{status}</h3>
              <span className="ml-auto bg-gray-100 text-gray-700 rounded-full h-6 w-6 flex items-center justify-center text-xs">
                {filteredRequests.filter(r => r.status === status).length}
              </span>
            </div>
            
            <div 
              className="bg-muted/50 p-2 rounded-lg flex-1 overflow-y-auto min-h-[300px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status as Status)}
            >
              {filteredRequests
                .filter(r => r.status === status)
                .map(request => (
                  <div 
                    key={request.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, request.id)}
                    className="mb-2 cursor-grab active:cursor-grabbing"
                  >
                    <RequestCard request={request} />
                  </div>
                ))
              }
              {filteredRequests.filter(r => r.status === status).length === 0 && (
                <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
                  Nenhuma solicitação
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Filtro de Data
  const CalendarComponent = () => (
    <div className="space-y-2">
      <Label>Período</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'dd/MM/yyyy')} - {format(dateRange.to, 'dd/MM/yyyy')}
                </>
              ) : (
                format(dateRange.from, 'dd/MM/yyyy')
              )
            ) : (
              "Selecione o período"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            locale={ptBR}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
  
  // List view for all users
  const ListView = () => (
    <div className="space-y-4">
      {/* Filtros */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter size={16} />
                Filtros
              </CardTitle>
              <CardDescription>
                Use os filtros para encontrar solicitações específicas
              </CardDescription>
            </div>
            <div className="flex">
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearFilters}
              >
                <X size={14} className="mr-1" /> Limpar Filtros
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro de Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  {statusList.map(status => (
                    <SelectItem key={status} value={status}>
                      {getStatusEmoji(status)} {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Filtro de Prioridade */}
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Filtrar por prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Prioridades</SelectItem>
                  {priorityList.map(priority => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Filtro de Solicitante (apenas para admin) */}
            {user.role === 'admin' && (
              <div className="space-y-2">
                <Label htmlFor="user">Solicitante</Label>
                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger id="user">
                    <SelectValue placeholder="Filtrar por solicitante" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Solicitantes</SelectItem>
                    {usersWithRequests.map(u => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name} {u.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Filtro de Data */}
            <CalendarComponent />
          </div>
        </CardContent>
      </Card>
      
      {/* Tabela de Solicitações */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-medium text-gray-500 border-b">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Data</th>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Tipo</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">Prioridade</th>
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
                    <td className="px-4 py-3 hidden md:table-cell">{formatRequestType(request.type)}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`inline-block w-2 h-2 rounded-full ${
                        request.priority === 'Moderado' ? 'bg-blue-500' : 
                        request.priority === 'Urgente' ? 'bg-orange-500' : 
                        'bg-red-500'
                      } mr-1`}></span>
                      {request.priority}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs">
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
              <Package size={16} className="text-emerald-600" />
              Entregues
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold">
              {filteredRequests.filter(r => r.status === 'Entregue').length}
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
