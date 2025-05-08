
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Types
export type Client = {
  id: string;
  name: string;
  municipality: string;
};

export type Unit = {
  id: string;
  name: string;
  clientId: string;
};

export type Budget = {
  id: string;
  name: string;
  clientId: string;
  monthlyAmount: number;
};

export type ItemGroup = 'Materiais' | 'Equipamentos' | 'Serviços' | 'Outros';

export type UnitOfMeasure = 'UN' | 'CX' | 'KG' | 'L' | 'M' | 'M²' | 'M³' | 'PCT';

export type Item = {
  id: string;
  group: ItemGroup;
  name: string;
  unitOfMeasure: UnitOfMeasure;
  averagePrice: number;
};

export type RequestType = 'Compra direta' | 'Cotação' | 'Serviço';

export type Priority = 'Moderada' | 'Urgente' | 'Emergencial';

export type Status = 
  'Aguardando liberação' | 
  'Em cotação' | 
  'Aguardando pagamento' | 
  'Pagamento realizado' | 
  'Aguardando entrega' | 
  'Solicitação rejeitada';

export type RequestItem = {
  id: string;
  itemId: string;
  quantity: number;
};

export type Request = {
  id: string;
  clientId: string;
  unitId: string;
  type: RequestType;
  justification: string;
  budgetId: string;
  priority: Priority;
  userId: string;
  createdAt: string;
  status: Status;
  items: RequestItem[];
};

// Create context
interface DataContextProps {
  clients: Client[];
  units: Unit[];
  budgets: Budget[];
  items: Item[];
  requests: Request[];
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  addUnit: (unit: Omit<Unit, 'id'>) => void;
  updateUnit: (unit: Unit) => void;
  deleteUnit: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  addItem: (item: Omit<Item, 'id'>) => void;
  updateItem: (item: Item) => void;
  deleteItem: (id: string) => void;
  createRequest: (request: Omit<Request, 'id' | 'createdAt' | 'status'>) => Promise<string>;
  updateRequest: (request: Request) => void;
  updateRequestStatus: (id: string, status: Status) => void;
  getRequestById: (id: string) => Request | undefined;
  getClientById: (id: string) => Client | undefined;
  getUnitById: (id: string) => Unit | undefined;
  getBudgetById: (id: string) => Budget | undefined;
  getItemById: (id: string) => Item | undefined;
  getUnitsByClientId: (clientId: string) => Unit[];
  getBudgetsByClientId: (clientId: string) => Budget[];
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();

  // Fetch data from Supabase on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch clients
        const { data: clientsData, error: clientsError } = await supabase
          .from('compras_clientes')
          .select('*');
        
        if (clientsError) throw clientsError;
        
        // Transform to Client type
        const transformedClients: Client[] = (clientsData || []).map(client => ({
          id: client.id.toString(),
          name: client.nome,
          municipality: client.municipio
        }));
        
        setClients(transformedClients);
        
        // Fetch units
        const { data: unitsData, error: unitsError } = await supabase
          .from('compras_unidades')
          .select('*');
        
        if (unitsError) throw unitsError;
        
        // Transform to Unit type
        const transformedUnits: Unit[] = (unitsData || []).map(unit => ({
          id: unit.id.toString(),
          name: unit.nome,
          clientId: unit.cliente_id.toString()
        }));
        
        setUnits(transformedUnits);
        
        // Fetch budgets
        const { data: budgetsData, error: budgetsError } = await supabase
          .from('compras_rubricas')
          .select('*');
        
        if (budgetsError) throw budgetsError;
        
        // Transform to Budget type
        const transformedBudgets: Budget[] = (budgetsData || []).map(budget => ({
          id: budget.id.toString(),
          name: budget.nome,
          clientId: budget.cliente_id.toString(),
          monthlyAmount: parseFloat(budget.valor_mensal)
        }));
        
        setBudgets(transformedBudgets);
        
        // Fetch items groups for mapping
        const { data: groupsData, error: groupsError } = await supabase
          .from('compras_grupos_itens')
          .select('*');
        
        if (groupsError) throw groupsError;
        
        // Fetch units of measure for mapping
        const { data: unitsOfMeasureData, error: unitsOfMeasureError } = await supabase
          .from('compras_unidades_medida')
          .select('*');
        
        if (unitsOfMeasureError) throw unitsOfMeasureError;
        
        // Create maps for faster lookups
        const groupsMap = new Map(
          (groupsData || []).map(group => [group.id.toString(), group.nome])
        );
        
        const unitsOfMeasureMap = new Map(
          (unitsOfMeasureData || []).map(unit => [unit.id.toString(), unit.sigla])
        );
        
        // Fetch items
        const { data: itemsData, error: itemsError } = await supabase
          .from('compras_itens')
          .select('*');
        
        if (itemsError) throw itemsError;
        
        // Transform to Item type
        const transformedItems: Item[] = (itemsData || []).map(item => ({
          id: item.id.toString(),
          group: groupsMap.get(item.grupo_id.toString()) as ItemGroup,
          name: item.nome,
          unitOfMeasure: unitsOfMeasureMap.get(item.unidade_medida_id.toString()) as UnitOfMeasure,
          averagePrice: parseFloat(item.valor_medio)
        }));
        
        setItems(transformedItems);
        
        // Fetch requests
        const { data: requestsData, error: requestsError } = await supabase
          .from('compras_solicitacoes')
          .select('*');
        
        if (requestsError) throw requestsError;
        
        // Fetch request items
        const { data: requestItemsData, error: requestItemsError } = await supabase
          .from('compras_itens_solicitacao')
          .select('*');
        
        if (requestItemsError) throw requestItemsError;
        
        // Group request items by request id
        const requestItemsMap = new Map();
        (requestItemsData || []).forEach(item => {
          const requestId = item.solicitacao_id.toString();
          if (!requestItemsMap.has(requestId)) {
            requestItemsMap.set(requestId, []);
          }
          requestItemsMap.get(requestId).push({
            id: item.id.toString(),
            itemId: item.item_id.toString(),
            quantity: parseFloat(item.quantidade)
          });
        });
        
        // Transform to Request type
        const transformedRequests: Request[] = (requestsData || []).map(request => ({
          id: request.id.toString(),
          clientId: request.cliente_id.toString(),
          unitId: request.unidade_id.toString(),
          type: request.tipo_solicitacao as RequestType,
          justification: request.justificativa,
          budgetId: request.rubrica_id.toString(),
          priority: request.prioridade as Priority,
          userId: request.usuario_id.toString(),
          createdAt: request.data_criacao,
          status: request.status as Status,
          items: requestItemsMap.get(request.id.toString()) || []
        }));
        
        setRequests(transformedRequests);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Client functions
  const addClient = async (client: Omit<Client, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('compras_clientes')
        .insert({
          nome: client.name,
          municipio: client.municipality
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const newClient: Client = {
          id: data.id.toString(),
          name: data.nome,
          municipality: data.municipio
        };
        
        setClients([...clients, newClient]);
        
        toast({
          title: "Cliente adicionado",
          description: `${client.name} foi adicionado com sucesso.`,
        });
      }
    } catch (error) {
      console.error("Error adding client:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o cliente.",
        variant: "destructive",
      });
    }
  };

  const updateClient = async (client: Client) => {
    try {
      const { error } = await supabase
        .from('compras_clientes')
        .update({
          nome: client.name,
          municipio: client.municipality
        })
        .eq('id', client.id);
      
      if (error) throw error;
      
      setClients(clients.map(c => c.id === client.id ? client : c));
      
      toast({
        title: "Cliente atualizado",
        description: `${client.name} foi atualizado com sucesso.`,
      });
    } catch (error) {
      console.error("Error updating client:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o cliente.",
        variant: "destructive",
      });
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const clientToDelete = clients.find(c => c.id === id);
      
      const { error } = await supabase
        .from('compras_clientes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setClients(clients.filter(c => c.id !== id));
      
      if (clientToDelete) {
        toast({
          title: "Cliente removido",
          description: `${clientToDelete.name} foi removido com sucesso.`,
        });
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o cliente.",
        variant: "destructive",
      });
    }
  };

  // Unit functions
  const addUnit = async (unit: Omit<Unit, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('compras_unidades')
        .insert({
          nome: unit.name,
          cliente_id: parseInt(unit.clientId)
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const newUnit: Unit = {
          id: data.id.toString(),
          name: data.nome,
          clientId: data.cliente_id.toString()
        };
        
        setUnits([...units, newUnit]);
        
        toast({
          title: "Unidade adicionada",
          description: `${unit.name} foi adicionada com sucesso.`,
        });
      }
    } catch (error) {
      console.error("Error adding unit:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a unidade.",
        variant: "destructive",
      });
    }
  };

  const updateUnit = async (unit: Unit) => {
    try {
      const { error } = await supabase
        .from('compras_unidades')
        .update({
          nome: unit.name,
          cliente_id: parseInt(unit.clientId)
        })
        .eq('id', unit.id);
      
      if (error) throw error;
      
      setUnits(units.map(u => u.id === unit.id ? unit : u));
      
      toast({
        title: "Unidade atualizada",
        description: `${unit.name} foi atualizada com sucesso.`,
      });
    } catch (error) {
      console.error("Error updating unit:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a unidade.",
        variant: "destructive",
      });
    }
  };

  const deleteUnit = async (id: string) => {
    try {
      const unitToDelete = units.find(u => u.id === id);
      
      const { error } = await supabase
        .from('compras_unidades')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setUnits(units.filter(u => u.id !== id));
      
      if (unitToDelete) {
        toast({
          title: "Unidade removida",
          description: `${unitToDelete.name} foi removida com sucesso.`,
        });
      }
    } catch (error) {
      console.error("Error deleting unit:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a unidade.",
        variant: "destructive",
      });
    }
  };

  // Budget functions
  const addBudget = async (budget: Omit<Budget, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('compras_rubricas')
        .insert({
          nome: budget.name,
          cliente_id: parseInt(budget.clientId),
          valor_mensal: budget.monthlyAmount
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const newBudget: Budget = {
          id: data.id.toString(),
          name: data.nome,
          clientId: data.cliente_id.toString(),
          monthlyAmount: parseFloat(data.valor_mensal)
        };
        
        setBudgets([...budgets, newBudget]);
        
        toast({
          title: "Rubrica adicionada",
          description: `${budget.name} foi adicionada com sucesso.`,
        });
      }
    } catch (error) {
      console.error("Error adding budget:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a rubrica.",
        variant: "destructive",
      });
    }
  };

  const updateBudget = async (budget: Budget) => {
    try {
      const { error } = await supabase
        .from('compras_rubricas')
        .update({
          nome: budget.name,
          cliente_id: parseInt(budget.clientId),
          valor_mensal: budget.monthlyAmount
        })
        .eq('id', budget.id);
      
      if (error) throw error;
      
      setBudgets(budgets.map(b => b.id === budget.id ? budget : b));
      
      toast({
        title: "Rubrica atualizada",
        description: `${budget.name} foi atualizada com sucesso.`,
      });
    } catch (error) {
      console.error("Error updating budget:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a rubrica.",
        variant: "destructive",
      });
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      const budgetToDelete = budgets.find(b => b.id === id);
      
      const { error } = await supabase
        .from('compras_rubricas')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setBudgets(budgets.filter(b => b.id !== id));
      
      if (budgetToDelete) {
        toast({
          title: "Rubrica removida",
          description: `${budgetToDelete.name} foi removida com sucesso.`,
        });
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a rubrica.",
        variant: "destructive",
      });
    }
  };

  // Item functions
  const addItem = async (item: Omit<Item, 'id'>) => {
    try {
      // Get group ID by name
      const { data: groupData, error: groupError } = await supabase
        .from('compras_grupos_itens')
        .select('id')
        .eq('nome', item.group)
        .single();
      
      if (groupError) throw groupError;
      
      // Get unit of measure ID by sigla
      const { data: unitOfMeasureData, error: unitOfMeasureError } = await supabase
        .from('compras_unidades_medida')
        .select('id')
        .eq('sigla', item.unitOfMeasure)
        .single();
      
      if (unitOfMeasureError) throw unitOfMeasureError;
      
      const { data, error } = await supabase
        .from('compras_itens')
        .insert({
          nome: item.name,
          grupo_id: groupData.id,
          unidade_medida_id: unitOfMeasureData.id,
          valor_medio: item.averagePrice
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const newItem: Item = {
          id: data.id.toString(),
          name: data.nome,
          group: item.group,
          unitOfMeasure: item.unitOfMeasure,
          averagePrice: parseFloat(data.valor_medio)
        };
        
        setItems([...items, newItem]);
        
        toast({
          title: "Item adicionado",
          description: `${item.name} foi adicionado com sucesso.`,
        });
      }
    } catch (error) {
      console.error("Error adding item:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o item.",
        variant: "destructive",
      });
    }
  };

  const updateItem = async (item: Item) => {
    try {
      // Get group ID by name
      const { data: groupData, error: groupError } = await supabase
        .from('compras_grupos_itens')
        .select('id')
        .eq('nome', item.group)
        .single();
      
      if (groupError) throw groupError;
      
      // Get unit of measure ID by sigla
      const { data: unitOfMeasureData, error: unitOfMeasureError } = await supabase
        .from('compras_unidades_medida')
        .select('id')
        .eq('sigla', item.unitOfMeasure)
        .single();
      
      if (unitOfMeasureError) throw unitOfMeasureError;
      
      const { error } = await supabase
        .from('compras_itens')
        .update({
          nome: item.name,
          grupo_id: groupData.id,
          unidade_medida_id: unitOfMeasureData.id,
          valor_medio: item.averagePrice
        })
        .eq('id', item.id);
      
      if (error) throw error;
      
      setItems(items.map(i => i.id === item.id ? item : i));
      
      toast({
        title: "Item atualizado",
        description: `${item.name} foi atualizado com sucesso.`,
      });
    } catch (error) {
      console.error("Error updating item:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o item.",
        variant: "destructive",
      });
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const itemToDelete = items.find(i => i.id === id);
      
      const { error } = await supabase
        .from('compras_itens')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setItems(items.filter(i => i.id !== id));
      
      if (itemToDelete) {
        toast({
          title: "Item removido",
          description: `${itemToDelete.name} foi removido com sucesso.`,
        });
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o item.",
        variant: "destructive",
      });
    }
  };

  // Request functions
  const createRequest = async (request: Omit<Request, 'id' | 'createdAt' | 'status'>): Promise<string> => {
    try {
      // Insert the main request
      const { data: requestData, error: requestError } = await supabase
        .from('compras_solicitacoes')
        .insert({
          cliente_id: parseInt(request.clientId),
          unidade_id: parseInt(request.unitId),
          tipo_solicitacao: request.type,
          justificativa: request.justification,
          rubrica_id: parseInt(request.budgetId),
          prioridade: request.priority,
          usuario_id: parseInt(request.userId)
        })
        .select()
        .single();
      
      if (requestError) throw requestError;
      
      // Insert request items
      const requestItems = request.items.map(item => ({
        solicitacao_id: requestData.id,
        item_id: parseInt(item.itemId),
        quantidade: item.quantity
      }));
      
      const { error: itemsError } = await supabase
        .from('compras_itens_solicitacao')
        .insert(requestItems);
      
      if (itemsError) throw itemsError;
      
      // Fetch the inserted items to get their IDs
      const { data: insertedItems, error: fetchItemsError } = await supabase
        .from('compras_itens_solicitacao')
        .select('*')
        .eq('solicitacao_id', requestData.id);
      
      if (fetchItemsError) throw fetchItemsError;
      
      // Create the transformed request for state update
      const newRequest: Request = {
        id: requestData.id.toString(),
        clientId: requestData.cliente_id.toString(),
        unitId: requestData.unidade_id.toString(),
        type: requestData.tipo_solicitacao as RequestType,
        justification: requestData.justificativa,
        budgetId: requestData.rubrica_id.toString(),
        priority: requestData.prioridade as Priority,
        userId: requestData.usuario_id.toString(),
        createdAt: requestData.data_criacao,
        status: requestData.status as Status,
        items: insertedItems.map(item => ({
          id: item.id.toString(),
          itemId: item.item_id.toString(),
          quantity: parseFloat(item.quantidade)
        }))
      };
      
      setRequests([...requests, newRequest]);
      
      toast({
        title: "✅ Solicitação criada!",
        description: "Entraremos em contato em breve.",
      });
      
      return requestData.id.toString();
    } catch (error) {
      console.error("Error creating request:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a solicitação.",
        variant: "destructive",
      });
      return '';
    }
  };

  const updateRequest = async (request: Request) => {
    try {
      // Update the main request
      const { error: requestError } = await supabase
        .from('compras_solicitacoes')
        .update({
          cliente_id: parseInt(request.clientId),
          unidade_id: parseInt(request.unitId),
          tipo_solicitacao: request.type,
          justificativa: request.justification,
          rubrica_id: parseInt(request.budgetId),
          prioridade: request.priority,
          status: request.status
        })
        .eq('id', request.id);
      
      if (requestError) throw requestError;
      
      // Delete existing items
      const { error: deleteItemsError } = await supabase
        .from('compras_itens_solicitacao')
        .delete()
        .eq('solicitacao_id', request.id);
      
      if (deleteItemsError) throw deleteItemsError;
      
      // Insert updated items
      const requestItems = request.items.map(item => ({
        solicitacao_id: parseInt(request.id),
        item_id: parseInt(item.itemId),
        quantidade: item.quantity
      }));
      
      const { error: insertItemsError } = await supabase
        .from('compras_itens_solicitacao')
        .insert(requestItems);
      
      if (insertItemsError) throw insertItemsError;
      
      setRequests(requests.map(r => r.id === request.id ? request : r));
      
      toast({
        title: "Solicitação atualizada",
        description: `A solicitação #${request.id} foi atualizada.`,
      });
    } catch (error) {
      console.error("Error updating request:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a solicitação.",
        variant: "destructive",
      });
    }
  };

  const updateRequestStatus = async (id: string, status: Status) => {
    try {
      const { error } = await supabase
        .from('compras_solicitacoes')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      setRequests(requests.map(r => 
        r.id === id ? { ...r, status } : r
      ));
      
      // Get emoji for status
      let emoji = '';
      switch(status) {
        case 'Em cotação': emoji = '🚀'; break;
        case 'Aguardando pagamento': emoji = '💸'; break;
        case 'Pagamento realizado': emoji = '✅'; break;
        case 'Aguardando entrega': emoji = '📦'; break;
        case 'Solicitação rejeitada': emoji = '❌'; break;
        default: emoji = '✅';
      }
      
      toast({
        title: `${emoji} Status atualizado`,
        description: `A solicitação #${id} agora está: ${status}`,
      });
    } catch (error) {
      console.error("Error updating request status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da solicitação.",
        variant: "destructive",
      });
    }
  };

  // Helper functions
  const getRequestById = (id: string) => {
    return requests.find(r => r.id === id);
  };

  const getClientById = (id: string) => {
    return clients.find(c => c.id === id);
  };

  const getUnitById = (id: string) => {
    return units.find(u => u.id === id);
  };

  const getBudgetById = (id: string) => {
    return budgets.find(b => b.id === id);
  };

  const getItemById = (id: string) => {
    return items.find(i => i.id === id);
  };

  const getUnitsByClientId = (clientId: string) => {
    return units.filter(u => u.clientId === clientId);
  };

  const getBudgetsByClientId = (clientId: string) => {
    return budgets.filter(b => b.clientId === clientId);
  };

  return (
    <DataContext.Provider value={{
      clients,
      units,
      budgets,
      items,
      requests,
      addClient,
      updateClient,
      deleteClient,
      addUnit,
      updateUnit,
      deleteUnit,
      addBudget,
      updateBudget,
      deleteBudget,
      addItem,
      updateItem,
      deleteItem,
      createRequest,
      updateRequest,
      updateRequestStatus,
      getRequestById,
      getClientById,
      getUnitById,
      getBudgetById,
      getItemById,
      getUnitsByClientId,
      getBudgetsByClientId,
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
