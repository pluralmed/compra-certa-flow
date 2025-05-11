import React, { useState } from 'react';
import { formatDateTime, getStatusEmoji, getStatusColor } from '@/utils/format';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

interface StatusHistoryItem {
  status: string;
  date: string;
  userId?: string;
}

interface StatusHistoryProps {
  history: StatusHistoryItem[];
}

const StatusHistory = ({ history }: StatusHistoryProps) => {
  const { users } = useAuth();
  const [visibleItems, setVisibleItems] = useState(3);
  
  // Ordenar o histórico pelo mais recente primeiro
  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Função para obter o nome do usuário
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.name} ${user.lastName}` : 'Usuário';
  };

  const handleLoadMore = () => {
    setVisibleItems(prev => prev + 3);
  };

  const visibleHistory = sortedHistory.slice(0, visibleItems);
  const hasMoreItems = visibleItems < sortedHistory.length;

  return (
    <div className="space-y-4">
      <div className="relative pl-6 space-y-6">
        {/* Linha vertical */}
        <div className="absolute left-[11px] top-[24px] bottom-6 w-0.5 bg-border"></div>
        
        {visibleHistory.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === visibleHistory.length - 1;
          const statusColor = getStatusColor(item.status);
          const borderColor = statusColor.replace('text-', 'border-');
          
          return (
            <div key={index} className="relative flex items-start gap-4">
              {/* Círculo indicador */}
              <div 
                className={`absolute left-[-11px] w-5 h-5 rounded-full bg-background border-2 ${borderColor}`}
              >
                {isFirst && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background animate-pulse"></div>
                )}
              </div>
              
              {/* Conteúdo */}
              <div className={`flex-1 p-3 rounded-lg border ${isFirst ? 'bg-muted/50' : ''}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span>{getStatusEmoji(item.status)}</span>
                  <p className={`font-medium ${statusColor}`}>{item.status}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(item.date)}
                  </p>
                  {item.userId && (
                    <p className="text-xs text-muted-foreground">
                      Por: {getUserName(item.userId)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {hasMoreItems && (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={handleLoadMore}
            className="text-teal border-teal hover:bg-teal/10"
          >
            Ver mais
          </Button>
        </div>
      )}
    </div>
  );
};

export default StatusHistory; 