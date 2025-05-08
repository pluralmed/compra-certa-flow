
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../AuthContext';

import { useClientService } from './services/clientService';
import { useUnitService } from './services/unitService';
import { useBudgetService } from './services/budgetService';
import { useItemGroupService } from './services/itemGroupService';
import { useUnitOfMeasureService } from './services/unitOfMeasureService';
import { useItemService } from './services/itemService';
import { useRequestService } from './services/requestService';

import { DataContextProps } from './types';

const DataContext = createContext<DataContextProps | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [fetched, setFetched] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Initialize all services
  const clientService = useClientService();
  const unitService = useUnitService();
  const budgetService = useBudgetService();
  const itemGroupService = useItemGroupService();
  const unitOfMeasureService = useUnitOfMeasureService();
  const itemService = useItemService();
  const requestService = useRequestService();
  
  // Fetch all data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        await Promise.all([
          clientService.fetchClients(),
          itemGroupService.fetchItemGroups(),
          unitOfMeasureService.fetchUnitsOfMeasure()
        ]);
        
        setFetched(true);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  // Fetch dependent data after initial fetch
  useEffect(() => {
    const fetchDependentData = async () => {
      if (!fetched || clientService.clients.length === 0) return;
      
      try {
        await Promise.all([
          unitService.fetchUnits(),
          budgetService.fetchBudgets(),
          itemService.fetchItems(),
          requestService.fetchRequests()
        ]);
      } catch (error) {
        console.error('Error fetching dependent data:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar todos os dados.",
          variant: "destructive",
        });
      }
    };
    
    fetchDependentData();
  }, [fetched, clientService.clients]);
  
  return (
    <DataContext.Provider value={{
      clients: clientService.clients,
      units: unitService.units,
      budgets: budgetService.budgets,
      itemGroups: itemGroupService.itemGroups,
      unitsOfMeasure: unitOfMeasureService.unitsOfMeasure,
      items: itemService.items,
      requests: requestService.requests,
      
      // Client methods
      addClient: clientService.addClient,
      updateClient: clientService.updateClient,
      deleteClient: clientService.deleteClient,
      getClientById: clientService.getClientById,
      
      // Unit methods
      addUnit: unitService.addUnit,
      updateUnit: unitService.updateUnit,
      deleteUnit: unitService.deleteUnit,
      getUnitById: unitService.getUnitById,
      
      // Budget methods
      addBudget: budgetService.addBudget,
      updateBudget: budgetService.updateBudget,
      deleteBudget: budgetService.deleteBudget,
      getBudgetById: budgetService.getBudgetById,
      
      // Item Group methods
      addItemGroup: itemGroupService.addItemGroup,
      updateItemGroup: itemGroupService.updateItemGroup,
      deleteItemGroup: itemGroupService.deleteItemGroup,
      
      // Unit of Measure methods
      addUnitOfMeasure: unitOfMeasureService.addUnitOfMeasure,
      updateUnitOfMeasure: unitOfMeasureService.updateUnitOfMeasure,
      deleteUnitOfMeasure: unitOfMeasureService.deleteUnitOfMeasure,
      
      // Item methods
      addItem: itemService.addItem,
      updateItem: itemService.updateItem,
      deleteItem: itemService.deleteItem,
      
      // Request methods
      createRequest: requestService.createRequest,
      updateRequest: requestService.updateRequest,
      deleteRequest: requestService.deleteRequest,
      updateRequestStatus: requestService.updateRequestStatus,
      
      // Loading states
      loading,
      fetched
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// Re-export types from types.ts for convenience
export * from './types';
