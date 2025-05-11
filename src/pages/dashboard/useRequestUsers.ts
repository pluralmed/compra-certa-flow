import { useMemo } from 'react';
import { User, Request } from '@/context/data/types';

export function useRequestUsers(requests: Request[], users: User[]) {
  // Obter usuários que realizaram solicitações
  const usersWithRequests = useMemo(() => {
    // Obter IDs únicos dos usuários que fizeram solicitações
    const userIds = [...new Set(requests.map(request => request.userId))];
    
    // Filtrar a lista de usuários para incluir apenas aqueles que fizeram solicitações
    return users.filter(user => userIds.includes(user.id));
  }, [requests, users]);

  return usersWithRequests;
} 