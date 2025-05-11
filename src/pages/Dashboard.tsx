import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/data/DataContext';
import { Status, Priority } from '@/context/data/types';

// Importar hooks personalizados
import { useDashboardFilters } from './dashboard/useDashboardFilters';
import { useFilteredRequests } from './dashboard/useFilteredRequests';
import { useRequestUsers } from './dashboard/useRequestUsers';

// Importar componentes
import DashboardHeader from './dashboard/DashboardHeader';
import StatsCards from './dashboard/StatsCards';
import KanbanView from './dashboard/KanbanView';
import ListView from './dashboard/ListView';

const statusList: Status[] = [
  'Aguardando liberação',
  'Em cotação',
  'Aguardando pagamento',
  'Pagamento realizado',
  'Aguardando entrega',
  'Entregue',
  'Solicitação rejeitada'
];

const priorityList: Priority[] = [
  'Moderado',
  'Urgente',
  'Emergencial'
];

// Dashboard will be our home page
const Dashboard = () => {
  const { user, users } = useAuth();
  const { requests, clients, units, updateRequestStatus } = useData();
  const [view, setView] = useState<'kanban' | 'list'>('list');
  
  // Constantes
  const itemsPerPage = 10;
  
  // Hooks personalizados
  const {
    filters,
    pagination: { currentPage, setCurrentPage },
    setStatusFilter,
    setPriorityFilter,
    setUserFilter,
    setDateRange,
    clearFilters,
    handleIdFilterChange
  } = useDashboardFilters();
  
  const filteredRequests = useFilteredRequests(requests, filters, user);
  const usersWithRequests = useRequestUsers(requests, users);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader 
        userRole={user.role} 
        view={view} 
        setView={setView} 
      />
      
      {/* Stats Cards */}
      <StatsCards filteredRequests={filteredRequests} />
      
      {/* Main Content */}
      <div>
        {user.role === 'admin' && view === 'kanban' ? (
          <KanbanView 
            filteredRequests={filteredRequests}
            clients={clients}
            units={units}
            users={users}
            statusList={statusList}
            updateRequestStatus={updateRequestStatus}
            userId={user.id}
          />
        ) : (
          <ListView 
            filteredRequests={filteredRequests}
            clients={clients}
            users={users}
            filters={filters}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            usersWithRequests={usersWithRequests}
            statusList={statusList}
            priorityList={priorityList}
            clearFilters={clearFilters}
            handleIdFilterChange={handleIdFilterChange}
            setStatusFilter={setStatusFilter}
            setPriorityFilter={setPriorityFilter}
            setUserFilter={setUserFilter}
            setDateRange={setDateRange}
            currentUserRole={user.role}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
