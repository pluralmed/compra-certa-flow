import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Request, Client, User } from '@/context/data/types';
import { Button } from '@/components/ui/button';
import { formatDate, getStatusEmoji, formatRequestType } from '@/utils/format';
import FilterCard from './FilterCard';
import { DashboardFilters } from './useDashboardFilters';

interface ListViewProps {
  filteredRequests: Request[];
  clients: Client[];
  users: User[];
  filters: DashboardFilters;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  usersWithRequests: User[];
  statusList: any[];
  priorityList: any[];
  clearFilters: () => void;
  handleIdFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setStatusFilter: (value: string) => void;
  setPriorityFilter: (value: string) => void;
  setUserFilter: (value: string) => void;
  setDateRange: (value: any) => void;
  currentUserRole: string;
}

const ListView = ({
  filteredRequests,
  clients,
  users,
  filters,
  currentPage,
  setCurrentPage,
  itemsPerPage,
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
}: ListViewProps) => {
  const navigate = useNavigate();
  
  // Calcular o número total de páginas
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  
  // Obter os itens da página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  
  // Função para mudar de página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Funções para avançar e retroceder página
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Filtros */}
      <FilterCard
        filters={filters}
        usersWithRequests={usersWithRequests}
        statusList={statusList}
        priorityList={priorityList}
        clearFilters={clearFilters}
        handleIdFilterChange={handleIdFilterChange}
        setStatusFilter={setStatusFilter}
        setPriorityFilter={setPriorityFilter}
        setUserFilter={setUserFilter}
        setDateRange={setDateRange}
        currentUserRole={currentUserRole}
      />
      
      {/* Tabela de Solicitações */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-medium text-gray-500 border-b">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Data</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">Cliente</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">Solicitante</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Tipo</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">Prioridade</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(request => {
                const client = clients.find(c => c.id === request.clientId);
                const requestCreator = users.find(u => u.id === request.userId);
                return (
                  <tr key={request.id} className="text-sm border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">#{request.id}</td>
                    <td className="px-4 py-3">{formatDate(request.createdAt)}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">{client?.name}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">{requestCreator ? `${requestCreator.name} ${requestCreator.lastName}` : 'Usuário'}</td>
                    <td className="px-4 py-3 hidden md:table-cell">{formatRequestType(request.type)}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`inline-block w-2 h-2 rounded-full ${
                        request.priority === 'Moderado' ? 'bg-blue-500' : 
                        request.priority === 'Urgente' ? 'bg-orange-500' : 
                        'bg-red-500'
                      } mr-1`}></span>
                      {request.priority}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs">
                        {getStatusEmoji(request.status)} {request.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/solicitacao/${request.id}`)}
                      >
                        Ver
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Nenhuma solicitação encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Controles de Paginação */}
        {filteredRequests.length > 0 && (
          <div className="flex justify-between items-center px-4 py-3 border-t">
            <div className="text-sm text-muted-foreground">
              Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a <span className="font-medium">
                {Math.min(indexOfLastItem, filteredRequests.length)}
              </span> de <span className="font-medium">{filteredRequests.length}</span> resultados
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={prevPage} 
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              
              <div className="flex items-center">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  // Lógica para mostrar as páginas corretas quando há muitas páginas
                  let pageNum = i + 1;
                  
                  if (totalPages > 5) {
                    if (currentPage <= 3) {
                      // Mostrar as primeiras 5 páginas
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      // Mostrar as últimas 5 páginas
                      pageNum = totalPages - 4 + i;
                    } else {
                      // Mostrar 2 páginas antes e 2 depois da atual
                      pageNum = currentPage - 2 + i;
                    }
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0 mx-1"
                      onClick={() => paginate(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={nextPage} 
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListView; 