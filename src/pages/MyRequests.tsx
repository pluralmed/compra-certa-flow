import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/data/DataContext';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
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
import { Eye, Plus } from 'lucide-react';
import { formatDate, getStatusEmoji, getStatusColor } from '@/utils/format';

const MyRequests = () => {
  const { user } = useAuth();
  const { requests, clients, units } = useData();
  const navigate = useNavigate();
  
  // Filter requests by the current user
  const userRequests = useMemo(() => {
    return requests.filter(r => r.userId === user?.id);
  }, [requests, user]);
  
  // Status filter
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Filtered requests
  const filteredRequests = useMemo(() => {
    let filtered;
    if (statusFilter === 'all') {
      filtered = userRequests;
    } else {
      filtered = userRequests.filter(r => r.status === statusFilter);
    }
    
    // Ordenar pelo ID de forma decrescente (do maior para o menor)
    return filtered.sort((a, b) => {
      // Converter para número para garantir ordenação correta
      const idA = parseInt(a.id);
      const idB = parseInt(b.id);
      return idB - idA;
    });
  }, [userRequests, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Minhas Solicitações</h2>
          <p className="text-muted-foreground">
            Visualize e acompanhe suas solicitações
          </p>
        </div>
        
        <Button onClick={() => navigate('/nova-solicitacao')} className="bg-teal hover:bg-teal/90">
          <Plus size={16} className="mr-2" />
          Nova Solicitação
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Filtrar Solicitações</CardTitle>
              <CardDescription>
                Use os filtros para encontrar solicitações específicas
              </CardDescription>
            </div>
            
            <div className="w-full sm:w-64">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Aguardando liberação">
                    {getStatusEmoji('Aguardando liberação')} Aguardando liberação
                  </SelectItem>
                  <SelectItem value="Em cotação">
                    {getStatusEmoji('Em cotação')} Em cotação
                  </SelectItem>
                  <SelectItem value="Aguardando pagamento">
                    {getStatusEmoji('Aguardando pagamento')} Aguardando pagamento
                  </SelectItem>
                  <SelectItem value="Pagamento realizado">
                    {getStatusEmoji('Pagamento realizado')} Pagamento realizado
                  </SelectItem>
                  <SelectItem value="Aguardando entrega">
                    {getStatusEmoji('Aguardando entrega')} Aguardando entrega
                  </SelectItem>
                  <SelectItem value="Solicitação rejeitada">
                    {getStatusEmoji('Solicitação rejeitada')} Solicitação rejeitada
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredRequests.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Solicitante</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map(request => {
                    const client = clients.find(c => c.id === request.clientId);
                    const unit = units.find(u => u.id === request.unitId);
                    
                    return (
                      <TableRow key={request.id}>
                        <TableCell>#{request.id}</TableCell>
                        <TableCell>{formatDate(request.createdAt)}</TableCell>
                        <TableCell>{client?.name || 'N/A'}</TableCell>
                        <TableCell>{unit?.name || 'N/A'}</TableCell>
                        <TableCell>{user ? `${user.name} ${user.lastName}` : 'Você'}</TableCell>
                        <TableCell>{request.type}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs text-white ${getStatusColor(request.status)}`}>
                            {getStatusEmoji(request.status)} {request.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => navigate(`/solicitacao/${request.id}`)}
                          >
                            <Eye size={16} className="mr-2" />
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {statusFilter === 'all' 
                  ? "Você ainda não possui solicitações." 
                  : "Nenhuma solicitação encontrada com este status."}
              </p>
              <Button onClick={() => navigate('/nova-solicitacao')} className="bg-teal hover:bg-teal/90">
                <Plus size={16} className="mr-2" />
                Criar Nova Solicitação
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyRequests;
