import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/data/DataContext';
import { Status } from '@/context/data/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Clock, HistoryIcon, SquarePen } from 'lucide-react';
import { formatCurrency, formatDateTime, getStatusEmoji, getStatusColor, getPriorityColor, formatRequestType } from '@/utils/format';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import StatusHistory from '@/components/status/StatusHistory';
import { Badge } from '@/components/ui/badge';
import RejectionModal from '@/components/modals/RejectionModal';
import ItemSelectionModal from '@/pages/requests/ItemSelectionModal';

const statusList: Status[] = [
  'Aguardando liberação',
  'Em cotação',
  'Aguardando pagamento',
  'Pagamento realizado',
  'Aguardando entrega',
  'Entregue',
  'Solicitação rejeitada'
];

const RequestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, users } = useAuth();
  const { 
    requests,
    clients,
    units,
    budgets,
    items,
    itemGroups,
    updateRequestStatus,
    updateRequest,
  } = useData();
  
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [isEditItemsModalOpen, setIsEditItemsModalOpen] = useState(false);
  const [isEditRequestModalOpen, setIsEditRequestModalOpen] = useState(false);
  
  const request = requests.find(req => req.id === id);
  
  if (!request) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Solicitação não encontrada</h2>
        <p className="text-muted-foreground mb-6">
          A solicitação que você está procurando não existe ou foi removida.
        </p>
        <Button onClick={() => navigate(-1)}>Voltar</Button>
      </div>
    );
  }
  
  const client = clients.find(c => c.id === request.clientId);
  const unit = units.find(u => u.id === request.unitId);
  const budget = budgets.find(b => b.id === request.budgetId);
  const requestCreator = users.find(u => u.id === request.userId);
  
  const handleStatusChange = (newStatus: Status) => {
    if (user?.role !== 'admin' || !user?.id) return;
    
    if (newStatus === 'Solicitação rejeitada') {
      setSelectedStatus(newStatus);
      setIsRejectionModalOpen(true);
    } else {
      updateRequestStatus(request.id, newStatus, user.id);
    }
  };
  
  const handleRejectionConfirm = (justification: string) => {
    if (!user?.id) return;
    
    updateRequestStatus(request.id, 'Solicitação rejeitada', user.id, justification);
    setIsRejectionModalOpen(false);
    setSelectedStatus(null);
  };
  
  // Calculate total value of request
  const totalValue = request.items.reduce((total, item) => {
    const product = items.find(i => i.id === item.itemId);
    if (!product) return total;
    return total + (product.averagePrice * item.quantity);
  }, 0);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          className="mr-2" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">
            Solicitação #{request.id}
          </h2>
          <p className="text-muted-foreground">
            Detalhes da solicitação
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Request Info */}
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>Informações da Solicitação</CardTitle>
              </div>
              {user?.role === 'admin' && (
                <Button size="icon" variant="outline" onClick={() => setIsEditRequestModalOpen(true)}>
                  <SquarePen size={22} />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-muted-foreground mb-1">Solicitante</h4>
                  <p className="font-medium">
                    {requestCreator ? `${requestCreator.name} ${requestCreator.lastName}` : 'Usuário não encontrado'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm text-muted-foreground mb-1">Data de Criação</h4>
                  <p className="font-medium">{formatDateTime(request.createdAt)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-muted-foreground mb-1">Cliente</h4>
                  <p className="font-medium">{client?.name}</p>
                </div>
                <div>
                  <h4 className="text-sm text-muted-foreground mb-1">Unidade</h4>
                  <p className="font-medium">{unit?.name}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-muted-foreground mb-1">Tipo de Solicitação</h4>
                  <p className="font-medium">{formatRequestType(request.type)}</p>
                </div>
                <div>
                  <h4 className="text-sm text-muted-foreground mb-1">Prioridade</h4>
                  <div className="flex items-center">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getPriorityColor(request.priority)}`}></span>
                    <p className="font-medium">{request.priority}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm text-muted-foreground mb-1">Rubrica</h4>
                <p className="font-medium">{budget?.name}</p>
              </div>
              
              <div>
                <h4 className="text-sm text-muted-foreground mb-1">Justificativa</h4>
                <p className="bg-muted/50 p-4 rounded-md">{request.justification}</p>
              </div>

              {/* Show rejection justification if available */}
              {request.status === 'Solicitação rejeitada' && request.justificationRejection && (
                <div>
                  <h4 className="text-sm text-muted-foreground mb-1">Motivo da Rejeição</h4>
                  <p className="bg-red-50 p-4 border border-red-100 rounded-md text-red-800">
                    {request.justificationRejection}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Items Table */}
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>Itens Solicitados</CardTitle>
                <CardDescription>
                  Lista de itens incluídos nesta solicitação
                </CardDescription>
              </div>
              {(user?.id === request.userId || user?.role === 'admin') && (
                <Button size="icon" variant="outline" onClick={() => setIsEditItemsModalOpen(true)}>
                  <SquarePen size={22} />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Grupo</TableHead>
                      <TableHead className="text-center">Quantidade</TableHead>
                      <TableHead>Unidade</TableHead>
                      <TableHead>Preço Unitário</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {request.items.map((requestItem) => {
                      const item = items.find(i => i.id === requestItem.itemId);
                      if (!item) return null;
                      
                      const total = item.averagePrice * requestItem.quantity;
                      
                      return (
                        <TableRow key={requestItem.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.group.name}</TableCell>
                          <TableCell className="text-center">{requestItem.quantity}</TableCell>
                          <TableCell>{item.unitOfMeasure.name}</TableCell>
                          <TableCell>{formatCurrency(item.averagePrice)}</TableCell>
                          <TableCell>{formatCurrency(total)}</TableCell>
                        </TableRow>
                      );
                    })}
                    
                    <TableRow className="bg-muted/30">
                      <TableCell colSpan={5} className="text-right font-medium">
                        Total da Solicitação:
                      </TableCell>
                      <TableCell className="font-bold">
                        {formatCurrency(totalValue)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Status Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status da Solicitação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 rounded-lg text-center border bg-muted/30">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${getStatusColor(request.status).replace('text-', 'bg-')} bg-opacity-20`}>
                  <span className="text-3xl">{getStatusEmoji(request.status)}</span>
                </div>
                <h3 className={`font-bold text-xl mb-1 ${getStatusColor(request.status)}`}>{request.status}</h3>
                <p className="text-sm text-muted-foreground">
                  Atualizado em: {formatDateTime(request.statusHistory?.[0]?.createdAt || request.createdAt)}
                </p>
              </div>
              
              {user?.role === 'admin' && (
                <div className="space-y-2">
                  <h4 className="font-medium">Alterar Status</h4>
                  <Select 
                    value={request.status} 
                    onValueChange={(value: Status) => handleStatusChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusList.map((status) => (
                        <SelectItem key={status} value={status}>
                          <div className="flex items-center gap-2">
                            <span>{getStatusEmoji(status)}</span>
                            <span>{status}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Histórico de Status */}
              {request.statusHistory && request.statusHistory.length > 0 && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <HistoryIcon size={18} className="text-muted-foreground" />
                    <h4 className="font-medium">Histórico de Status</h4>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4">
                    <StatusHistory 
                      history={request.statusHistory.map(item => ({
                        status: item.status,
                        date: item.createdAt,
                        userId: item.userId
                      }))} 
                    />
                  </div>
                  
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock size={12} />
                    <span>Última atualização: {formatDateTime(request.statusHistory[0]?.createdAt || request.createdAt)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Rejection Modal */}
      <RejectionModal
        isOpen={isRejectionModalOpen}
        onClose={() => setIsRejectionModalOpen(false)}
        onConfirm={handleRejectionConfirm}
        requestId={request.id}
      />

      {/* Modal de edição de itens */}
      {(user?.id === request.userId || user?.role === 'admin') && (
        <ItemSelectionModal
          open={isEditItemsModalOpen}
          onOpenChange={setIsEditItemsModalOpen}
          items={request.items.map(requestItem => {
            const item = items.find(i => i.id === requestItem.itemId);
            return item ? {
              id: item.id,
              name: item.name,
              quantity: requestItem.quantity,
              unitOfMeasure: item.unitOfMeasure.abbreviation
            } : null;
          }).filter(Boolean)}
          onConfirm={async (newItems) => {
            // Atualizar os itens da solicitação
            const updatedRequest = {
              ...request,
              items: newItems.map(tempItem => ({
                id: '', // será ignorado no update
                itemId: tempItem.id,
                quantity: tempItem.quantity
              }))
            };
            await updateRequest(updatedRequest);
          }}
          availableItems={items}
          itemGroups={itemGroups}
        />
      )}
    </div>
  );
};

export default RequestDetails;
