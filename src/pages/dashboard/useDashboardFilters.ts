import { useState, useEffect } from 'react';
import { DateRange } from "react-day-picker";

export interface DashboardFilters {
  idFilter: string;
  statusFilter: string;
  priorityFilter: string;
  userFilter: string;
  dateRange: DateRange | undefined;
}

export function useDashboardFilters() {
  // Filtros
  const [idFilter, setIdFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  
  // Resetar a paginação quando os filtros mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, priorityFilter, userFilter, dateRange, idFilter]);
  
  // Limpar filtros
  const clearFilters = () => {
    setIdFilter('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setUserFilter('all');
    setDateRange(undefined);
  };
  
  // Função para aceitar apenas números no filtro de ID
  const handleIdFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permite apenas dígitos (números)
    if (!value || /^\d*$/.test(value)) {
      setIdFilter(value);
    }
  };

  return {
    filters: {
      idFilter,
      statusFilter,
      priorityFilter,
      userFilter,
      dateRange
    },
    pagination: {
      currentPage,
      setCurrentPage
    },
    setStatusFilter,
    setPriorityFilter,
    setUserFilter,
    setDateRange,
    clearFilters,
    handleIdFilterChange
  };
} 