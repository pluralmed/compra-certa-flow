import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Request, Client, Unit, User } from '@/context/data/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/format';

interface RequestCardProps {
  request: Request;
  clients: Client[];
  units: Unit[];
  users: User[];
}

const RequestCard = ({ request, clients, units, users }: RequestCardProps) => {
  const navigate = useNavigate();
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

export default RequestCard; 