import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Filter, X, CalendarIcon } from 'lucide-react';
import { Status, Priority, User } from '@/context/data/types';
import { getStatusEmoji } from '@/utils/format';
import { DashboardFilters } from './useDashboardFilters';

interface FilterCardProps {
  filters: DashboardFilters;
  usersWithRequests: User[];
  statusList: Status[];
  priorityList: Priority[];
  clearFilters: () => void;
  handleIdFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setStatusFilter: (value: string) => void;
  setPriorityFilter: (value: string) => void;
  setUserFilter: (value: string) => void;
  setDateRange: (value: any) => void;
  currentUserRole: string;
}

const FilterCard = ({
  filters,
  usersWithRequests,
  statusList,
  priorityList,
  clearFilters,
  handleIdFilterChange,
  setStatusFilter,
  setPriorityFilter,
  setUserFilter,
  setDateRange,
  currentUserRole
}: FilterCardProps) => {
  return (
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
        <div className="flex items-center justify-between gap-3">
          {/* Filtro de ID (apenas para admin) */}
          {currentUserRole === 'admin' && (
            <div className="flex-1 min-w-[120px]">
              <Label htmlFor="request-id" className="mb-2 block">ID da Solicitação</Label>
              <Input
                id="request-id"
                placeholder="Buscar por ID"
                value={filters.idFilter}
                onChange={handleIdFilterChange}
                inputMode="numeric"
                className="w-full"
                autoComplete="off"
              />
            </div>
          )}
          
          {/* Filtro de Status */}
          <div className="flex-1 min-w-[120px]">
            <Label htmlFor="status" className="mb-2 block">Status</Label>
            <Select value={filters.statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status" className="w-full">
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
          <div className="flex-1 min-w-[120px]">
            <Label htmlFor="priority" className="mb-2 block">Prioridade</Label>
            <Select value={filters.priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger id="priority" className="w-full">
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
          {currentUserRole === 'admin' && (
            <div className="flex-1 min-w-[120px]">
              <Label htmlFor="user" className="mb-2 block">Solicitante</Label>
              <Select value={filters.userFilter} onValueChange={setUserFilter}>
                <SelectTrigger id="user" className="w-full">
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
          <div className="flex-1 min-w-[150px]">
            <Label className="mb-2 block">Período</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange?.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, 'dd/MM/yyyy')} - {format(filters.dateRange.to, 'dd/MM/yyyy')}
                      </>
                    ) : (
                      format(filters.dateRange.from, 'dd/MM/yyyy')
                    )
                  ) : (
                    "Selecione o período"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={filters.dateRange}
                  onSelect={setDateRange}
                  locale={ptBR}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterCard; 