import { useMemo } from 'react';
import { format, isAfter, isBefore, parseISO, startOfDay, endOfDay } from 'date-fns';
import { DashboardFilters } from './useDashboardFilters';
import { User, Request } from '@/context/data/types';

export function useFilteredRequests(
  requests: Request[],
  filters: DashboardFilters,
  user: User
) {
  // Filter requests by user role and filters
  const filteredRequests = useMemo(() => {
    // Primeiro filtrar por papel do usuário
    let filtered = user.role === 'admin' 
      ? requests 
      : requests.filter(req => req.userId === user.id);
    
    // Filtrar por ID (apenas para admin)
    if (user.role === 'admin' && filters.idFilter.trim() !== '') {
      filtered = filtered.filter(req => req.id.includes(filters.idFilter.trim()));
    }
    
    // Filtrar por status
    if (filters.statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === filters.statusFilter);
    }
    
    // Filtrar por prioridade
    if (filters.priorityFilter !== 'all') {
      filtered = filtered.filter(req => req.priority === filters.priorityFilter);
    }
    
    // Filtrar por usuário (apenas para admin)
    if (user.role === 'admin' && filters.userFilter !== 'all') {
      filtered = filtered.filter(req => req.userId === filters.userFilter);
    }
    
    // Filtrar por data
    if (filters.dateRange?.from) {
      const fromDate = startOfDay(filters.dateRange.from);
      filtered = filtered.filter(req => {
        const requestDate = parseISO(req.createdAt);
        return isAfter(requestDate, fromDate) || requestDate.getTime() === fromDate.getTime();
      });
    }
    
    if (filters.dateRange?.to) {
      const toDate = endOfDay(filters.dateRange.to);
      filtered = filtered.filter(req => {
        const requestDate = parseISO(req.createdAt);
        return isBefore(requestDate, toDate) || requestDate.getTime() === toDate.getTime();
      });
    }
    
    // Ordenar pelo ID de forma decrescente (do maior para o menor)
    return filtered.sort((a, b) => {
      // Converter para número para garantir ordenação correta
      const idA = parseInt(a.id);
      const idB = parseInt(b.id);
      return idB - idA;
    });
  }, [requests, user, filters]);

  return filteredRequests;
} 