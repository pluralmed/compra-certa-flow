import React from 'react';
import { Request, Client, Unit, User, Status } from '@/context/data/types';
import { getStatusEmoji } from '@/utils/format';
import RequestCard from './RequestCard';

interface KanbanViewProps {
  filteredRequests: Request[];
  clients: Client[];
  units: Unit[];
  users: User[];
  statusList: Status[];
  updateRequestStatus: (requestId: string, status: Status, userId: string) => void;
  userId: string;
}

const KanbanView = ({ 
  filteredRequests, 
  clients, 
  units, 
  users, 
  statusList,
  updateRequestStatus,
  userId
}: KanbanViewProps) => {
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
      updateRequestStatus(requestId, newStatus, userId);
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
                  <RequestCard 
                    request={request} 
                    clients={clients} 
                    units={units} 
                    users={users} 
                  />
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

export default KanbanView; 