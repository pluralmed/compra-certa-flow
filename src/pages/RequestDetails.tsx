
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData, Status } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { formatCurrency, formatDateTime, getStatusEmoji, getStatusColor, getPriorityColor } from '@/utils/format';
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

const statusList: Status[] = [
  'Aguardando liberação',
  'Em cotação',
  'Aguardando pagamento',
  'Pagamento realizado',
  'Aguardando entrega',
  'Solicitação rejeitada'
];

const RequestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    getRequestById, 
    getClientById, 
    getUnitById,
    getBudgetById,
    items,
    updateRequestStatus,
  } = useData();
  
  const request = getRequestById(id || '');
  
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
  
  const client = getClientById(request.clientId);
  const unit = getUnitById(request.unitId);
  const budget = getBudgetById(request.budgetId);
  
  const handleStatusChange = (newStatus: Status) => {
    if (user?.role !== 'admin') return;
    updateRequestStatus(request.id, newStatus);
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
            <CardHeader>
              <CardTitle>Informações da Solicitação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <p className="font-medium">{request.type}</p>
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
            </CardContent>
          </Card>
          
          {/* Items Table */}
          <Card>
            <CardHeader>
              <CardTitle>Itens Solicitados</CardTitle>
              <CardDescription>
                Lista de itens incluídos nesta solicitação
              </CardDescription>
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
                          <TableCell>{item.group}</TableCell>
                          <TableCell className="text-center">{requestItem.quantity}</TableCell>
                          <TableCell>{item.unitOfMeasure}</TableCell>
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
              <div className={`p-6 rounded-lg text-center ${getStatusColor(request.status)} bg-opacity-20 border border-opacity-30 ${getStatusColor(request.status)}`}>
                <span className="text-3xl block mb-2">{getStatusEmoji(request.status)}</span>
                <h3 className="font-bold text-lg">{request.status}</h3>
                <p className="text-sm opacity-80">Atualizado em: {formatDateTime(request.createdAt)}</p>
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
                          {getStatusEmoji(status)} {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm text-muted-foreground mb-1">Solicitado por</h4>
                <p className="font-medium">{user?.name} {user?.lastName}</p>
                <p className="text-sm text-muted-foreground">{user?.sector}</p>
              </div>
              
              <div>
                <h4 className="text-sm text-muted-foreground mb-1">Data da Solicitação</h4>
                <p className="font-medium">{formatDateTime(request.createdAt)}</p>
              </div>
              
              <div>
                <h4 className="text-sm text-muted-foreground mb-1">ID da Solicitação</h4>
                <p className="font-medium">#{request.id}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
