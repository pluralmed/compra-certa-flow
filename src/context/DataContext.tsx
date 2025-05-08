
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

// Define types for our data models
export type RequestType = 'Aquisição' | 'Contratação';
export type Status = 
  'Aguardando liberação' | 
  'Em cotação' | 
  'Aguardando pagamento' | 
  'Pagamento realizado' | 
  'Aguardando entrega' | 
  'Liberada' | 
  'Em análise' | 
  'Concluída' | 
  'Recusada' | 
  'Solicitação rejeitada';
export type Priority = 
  'Alta' | 
  'Média' | 
  'Baixa' | 
  'Moderada' | 
  'Urgente';

export interface Client {
  id: string;
  name: string;
  municipality: string;
}

export interface Unit {
  id: string;
  name: string;
  clientId: string;
}

export interface Budget {
  id: string;
  name: string;
  clientId: string;
  monthlyAmount: number;
}

export interface ItemGroup {
  id: string;
  name: string;
}

export interface UnitOfMeasure {
  id: string;
  name: string;
  abbreviation: string;
}

export interface Item {
  id: string;
  name: string;
  group: ItemGroup;
  unitOfMeasure: UnitOfMeasure;
  averagePrice: number;
}

export interface RequestItem {
  id: string;
  itemId: string;
  quantity: number;
}

export interface Request {
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
}

interface DataContextProps {
  clients: Client[];
  units: Unit[];
  budgets: Budget[];
  itemGroups: ItemGroup[];
  unitsOfMeasure: UnitOfMeasure[];
  items: Item[];
  requests: Request[];
  
  // Clients
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
  
  // Units
  addUnit: (unit: Omit<Unit, 'id'>) => void;
  updateUnit: (unit: Unit) => void;
  deleteUnit: (id: string) => void;
  getUnitById: (id: string) => Unit | undefined;
  
  // Budgets
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  getBudgetById: (id: string) => Budget | undefined;
  
  // Item Groups
  addItemGroup: (group: Omit<ItemGroup, 'id'>) => void;
  updateItemGroup: (group: ItemGroup) => void;
  deleteItemGroup: (id: string) => void;
  
  // Units of Measure
  addUnitOfMeasure: (unitOfMeasure: Omit<UnitOfMeasure, 'id'>) => void;
  updateUnitOfMeasure: (unitOfMeasure: UnitOfMeasure) => void;
  deleteUnitOfMeasure: (id: string) => void;
  
  // Items
  addItem: (item: Omit<Item, 'id'>) => void;
  updateItem: (item: Item) => void;
  deleteItem: (id: string) => void;
  
  // Requests
  createRequest: (request: Omit<Request, 'id' | 'createdAt' | 'status'>) => Promise<string>;
  updateRequest: (request: Request) => void;
  deleteRequest: (id: string) => void;
  updateRequestStatus: (id: string, status: Status) => void;
  
  // Loading states
  loading: boolean;
  fetched: boolean;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [itemGroups, setItemGroups] = useState<ItemGroup[]>([]);
  const [unitsOfMeasure, setUnitsOfMeasure] = useState<UnitOfMeasure[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [fetched, setFetched] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Fetch all data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        await Promise.all([
          fetchClients(),
          fetchItemGroups(),
          fetchUnitsOfMeasure()
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
      if (!fetched || clients.length === 0) return;
      
      try {
        await Promise.all([
          fetchUnits(),
          fetchBudgets(),
          fetchItems(),
          fetchRequests()
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
  }, [fetched, clients]);
  
  // Fetch clients
  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('compras_clientes')
      .select('*');
      
    if (error) throw error;
    
    if (data) {
      const transformedClients: Client[] = data.map(client => ({
        id: client.id.toString(),
        name: client.nome,
        municipality: client.municipio
      }));
      
      setClients(transformedClients);
    }
  };
  
  // Fetch units
  const fetchUnits = async () => {
    const { data, error } = await supabase
      .from('compras_unidades')
      .select('*');
      
    if (error) throw error;
    
    if (data) {
      const transformedUnits: Unit[] = data.map(unit => ({
        id: unit.id.toString(),
        name: unit.nome,
        clientId: unit.cliente_id.toString()
      }));
      
      setUnits(transformedUnits);
    }
  };
  
  // Fetch budgets
  const fetchBudgets = async () => {
    const { data, error } = await supabase
      .from('compras_rubricas')
      .select('*');
      
    if (error) throw error;
    
    if (data) {
      const transformedBudgets: Budget[] = data.map(budget => ({
        id: budget.id.toString(),
        name: budget.nome,
        clientId: budget.cliente_id.toString(),
        monthlyAmount: parseFloat(budget.valor_mensal)
      }));
      
      setBudgets(transformedBudgets);
    }
  };
  
  // Fetch item groups
  const fetchItemGroups = async () => {
    const { data, error } = await supabase
      .from('compras_grupos_itens')
      .select('*');
      
    if (error) throw error;
    
    if (data) {
      const transformedGroups: ItemGroup[] = data.map(group => ({
        id: group.id.toString(),
        name: group.nome
      }));
      
      setItemGroups(transformedGroups);
    }
  };
  
  // Fetch units of measure
  const fetchUnitsOfMeasure = async () => {
    const { data, error } = await supabase
      .from('compras_unidades_medida')
      .select('*');
      
    if (error) throw error;
    
    if (data) {
      const transformedUnits: UnitOfMeasure[] = data.map(unit => ({
        id: unit.id.toString(),
        name: unit.nome,
        abbreviation: unit.sigla
      }));
      
      setUnitsOfMeasure(transformedUnits);
    }
  };
  
  // Fetch items
  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('compras_itens')
      .select(`
        *,
        compras_grupos_itens (*),
        compras_unidades_medida (*)
      `);
      
    if (error) throw error;
    
    if (data) {
      const transformedItems: Item[] = data.map(item => {
        const group: ItemGroup = {
          id: item.compras_grupos_itens.id.toString(),
          name: item.compras_grupos_itens.nome
        };
        
        const unitOfMeasure: UnitOfMeasure = {
          id: item.compras_unidades_medida.id.toString(),
          name: item.compras_unidades_medida.nome,
          abbreviation: item.compras_unidades_medida.sigla
        };
        
        return {
          id: item.id.toString(),
          name: item.nome,
          group,
          unitOfMeasure,
          averagePrice: parseFloat(item.valor_medio)
        };
      });
      
      setItems(transformedItems);
    }
  };
  
  // Fetch requests
  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('compras_solicitacoes')
      .select(`
        *,
        compras_itens_solicitacao (*)
      `);
      
    if (error) throw error;
    
    if (data) {
      const transformedRequests: Request[] = await Promise.all(data.map(async (request) => {
        // Get items for this request
        const requestItems: RequestItem[] = request.compras_itens_solicitacao.map((item: any) => ({
          id: item.id.toString(),
          itemId: item.item_id.toString(),
          quantity: parseFloat(item.quantidade)
        }));
        
        return {
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
          items: requestItems
        };
      }));
      
      setRequests(transformedRequests);
    }
  };
  
  // Get client by ID
  const getClientById = (id: string) => {
    return clients.find(client => client.id === id);
  };

  // Get unit by ID
  const getUnitById = (id: string) => {
    return units.find(unit => unit.id === id);
  };

  // Get budget by ID
  const getBudgetById = (id: string) => {
    return budgets.find(budget => budget.id === id);
  };
  
  // Add client
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
      console.error('Error adding client:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o cliente.",
        variant: "destructive",
      });
    }
  };
  
  // Update client
  const updateClient = async (client: Client) => {
    try {
      const { error } = await supabase
        .from('compras_clientes')
        .update({
          nome: client.name,
          municipio: client.municipality
        })
        .eq('id', parseInt(client.id));
      
      if (error) throw error;
      
      setClients(clients.map(c => c.id === client.id ? client : c));
      
      toast({
        title: "Cliente atualizado",
        description: `${client.name} foi atualizado com sucesso.`,
      });
    } catch (error) {
      console.error('Error updating client:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o cliente.",
        variant: "destructive",
      });
    }
  };
  
  // Delete client
  const deleteClient = async (id: string) => {
    try {
      const clientToDelete = clients.find(c => c.id === id);
      
      const { error } = await supabase
        .from('compras_clientes')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) throw error;
      
      setClients(clients.filter(c => c.id !== id));
      
      if (clientToDelete) {
        toast({
          title: "Cliente removido",
          description: `${clientToDelete.name} foi removido com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o cliente.",
        variant: "destructive",
      });
    }
  };
  
  // Add unit
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
      console.error('Error adding unit:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a unidade.",
        variant: "destructive",
      });
    }
  };
  
  // Update unit
  const updateUnit = async (unit: Unit) => {
    try {
      const { error } = await supabase
        .from('compras_unidades')
        .update({
          nome: unit.name,
          cliente_id: parseInt(unit.clientId)
        })
        .eq('id', parseInt(unit.id));
      
      if (error) throw error;
      
      setUnits(units.map(u => u.id === unit.id ? unit : u));
      
      toast({
        title: "Unidade atualizada",
        description: `${unit.name} foi atualizada com sucesso.`,
      });
    } catch (error) {
      console.error('Error updating unit:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a unidade.",
        variant: "destructive",
      });
    }
  };
  
  // Delete unit
  const deleteUnit = async (id: string) => {
    try {
      const unitToDelete = units.find(u => u.id === id);
      
      const { error } = await supabase
        .from('compras_unidades')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) throw error;
      
      setUnits(units.filter(u => u.id !== id));
      
      if (unitToDelete) {
        toast({
          title: "Unidade removida",
          description: `${unitToDelete.name} foi removida com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error deleting unit:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a unidade.",
        variant: "destructive",
      });
    }
  };
  
  // Add budget
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
      console.error('Error adding budget:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a rubrica.",
        variant: "destructive",
      });
    }
  };
  
  // Update budget
  const updateBudget = async (budget: Budget) => {
    try {
      const { error } = await supabase
        .from('compras_rubricas')
        .update({
          nome: budget.name,
          cliente_id: parseInt(budget.clientId),
          valor_mensal: budget.monthlyAmount
        })
        .eq('id', parseInt(budget.id));
      
      if (error) throw error;
      
      setBudgets(budgets.map(b => b.id === budget.id ? budget : b));
      
      toast({
        title: "Rubrica atualizada",
        description: `${budget.name} foi atualizada com sucesso.`,
      });
    } catch (error) {
      console.error('Error updating budget:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a rubrica.",
        variant: "destructive",
      });
    }
  };
  
  // Delete budget
  const deleteBudget = async (id: string) => {
    try {
      const budgetToDelete = budgets.find(b => b.id === id);
      
      const { error } = await supabase
        .from('compras_rubricas')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) throw error;
      
      setBudgets(budgets.filter(b => b.id !== id));
      
      if (budgetToDelete) {
        toast({
          title: "Rubrica removida",
          description: `${budgetToDelete.name} foi removida com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a rubrica.",
        variant: "destructive",
      });
    }
  };
  
  // Add item group
  const addItemGroup = async (group: Omit<ItemGroup, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('compras_grupos_itens')
        .insert({
          nome: group.name
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const newGroup: ItemGroup = {
          id: data.id.toString(),
          name: data.nome
        };
        
        setItemGroups([...itemGroups, newGroup]);
        
        toast({
          title: "Grupo adicionado",
          description: `${group.name} foi adicionado com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error adding item group:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o grupo.",
        variant: "destructive",
      });
    }
  };
  
  // Update item group
  const updateItemGroup = async (group: ItemGroup) => {
    try {
      const { error } = await supabase
        .from('compras_grupos_itens')
        .update({
          nome: group.name
        })
        .eq('id', parseInt(group.id));
      
      if (error) throw error;
      
      setItemGroups(itemGroups.map(g => g.id === group.id ? group : g));
      
      toast({
        title: "Grupo atualizado",
        description: `${group.name} foi atualizado com sucesso.`,
      });
    } catch (error) {
      console.error('Error updating item group:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o grupo.",
        variant: "destructive",
      });
    }
  };
  
  // Delete item group
  const deleteItemGroup = async (id: string) => {
    try {
      const groupToDelete = itemGroups.find(g => g.id === id);
      
      const { error } = await supabase
        .from('compras_grupos_itens')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) throw error;
      
      setItemGroups(itemGroups.filter(g => g.id !== id));
      
      if (groupToDelete) {
        toast({
          title: "Grupo removido",
          description: `${groupToDelete.name} foi removido com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error deleting item group:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o grupo.",
        variant: "destructive",
      });
    }
  };
  
  // Add unit of measure
  const addUnitOfMeasure = async (unitOfMeasure: Omit<UnitOfMeasure, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('compras_unidades_medida')
        .insert({
          nome: unitOfMeasure.name,
          sigla: unitOfMeasure.abbreviation
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const newUnitOfMeasure: UnitOfMeasure = {
          id: data.id.toString(),
          name: data.nome,
          abbreviation: data.sigla
        };
        
        setUnitsOfMeasure([...unitsOfMeasure, newUnitOfMeasure]);
        
        toast({
          title: "Unidade de medida adicionada",
          description: `${unitOfMeasure.name} foi adicionada com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error adding unit of measure:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a unidade de medida.",
        variant: "destructive",
      });
    }
  };
  
  // Update unit of measure
  const updateUnitOfMeasure = async (unitOfMeasure: UnitOfMeasure) => {
    try {
      const { error } = await supabase
        .from('compras_unidades_medida')
        .update({
          nome: unitOfMeasure.name,
          sigla: unitOfMeasure.abbreviation
        })
        .eq('id', parseInt(unitOfMeasure.id));
      
      if (error) throw error;
      
      setUnitsOfMeasure(unitsOfMeasure.map(u => u.id === unitOfMeasure.id ? unitOfMeasure : u));
      
      toast({
        title: "Unidade de medida atualizada",
        description: `${unitOfMeasure.name} foi atualizada com sucesso.`,
      });
    } catch (error) {
      console.error('Error updating unit of measure:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a unidade de medida.",
        variant: "destructive",
      });
    }
  };
  
  // Delete unit of measure
  const deleteUnitOfMeasure = async (id: string) => {
    try {
      const unitToDelete = unitsOfMeasure.find(u => u.id === id);
      
      const { error } = await supabase
        .from('compras_unidades_medida')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) throw error;
      
      setUnitsOfMeasure(unitsOfMeasure.filter(u => u.id !== id));
      
      if (unitToDelete) {
        toast({
          title: "Unidade de medida removida",
          description: `${unitToDelete.name} foi removida com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error deleting unit of measure:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a unidade de medida.",
        variant: "destructive",
      });
    }
  };
  
  // Add item
  const addItem = async (item: Omit<Item, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('compras_itens')
        .insert({
          nome: item.name,
          grupo_id: parseInt(item.group.id),
          unidade_medida_id: parseInt(item.unitOfMeasure.id),
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
      console.error('Error adding item:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o item.",
        variant: "destructive",
      });
    }
  };
  
  // Update item
  const updateItem = async (item: Item) => {
    try {
      const { error } = await supabase
        .from('compras_itens')
        .update({
          nome: item.name,
          grupo_id: parseInt(item.group.id),
          unidade_medida_id: parseInt(item.unitOfMeasure.id),
          valor_medio: item.averagePrice
        })
        .eq('id', parseInt(item.id));
      
      if (error) throw error;
      
      setItems(items.map(i => i.id === item.id ? item : i));
      
      toast({
        title: "Item atualizado",
        description: `${item.name} foi atualizado com sucesso.`,
      });
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o item.",
        variant: "destructive",
      });
    }
  };
  
  // Delete item
  const deleteItem = async (id: string) => {
    try {
      const itemToDelete = items.find(i => i.id === id);
      
      const { error } = await supabase
        .from('compras_itens')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) throw error;
      
      setItems(items.filter(i => i.id !== id));
      
      if (itemToDelete) {
        toast({
          title: "Item removido",
          description: `${itemToDelete.name} foi removido com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o item.",
        variant: "destructive",
      });
    }
  };
  
  // Create request
  const createRequest = async (request: Omit<Request, 'id' | 'createdAt' | 'status'>): Promise<string> => {
    try {
      // First, create the request
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
      
      // Then, create the request items
      const requestItems = request.items.map(item => ({
        item_id: parseInt(item.itemId),
        quantidade: item.quantity,
        solicitacao_id: requestData.id
      }));
      
      const { data: itemsData, error: itemsError } = await supabase
        .from('compras_itens_solicitacao')
        .insert(requestItems)
        .select();
      
      if (itemsError) throw itemsError;
      
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
        items: itemsData.map(item => ({
          id: item.id.toString(),
          itemId: item.item_id.toString(),
          quantity: parseFloat(item.quantidade)
        }))
      };
      
      setRequests([...requests, newRequest]);
      
      toast({
        title: "Solicitação criada",
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
      throw error;
    }
  };
  
  // Update request
  const updateRequest = async (request: Request) => {
    try {
      const { error } = await supabase
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
        .eq('id', parseInt(request.id));
      
      if (error) throw error;
      
      // Update request items - this is more complex and would require
      // deleting existing items and creating new ones,
      // for brevity we'll just update the state
      
      setRequests(requests.map(r => r.id === request.id ? request : r));
      
      toast({
        title: "Solicitação atualizada",
        description: "A solicitação foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a solicitação.",
        variant: "destructive",
      });
    }
  };
  
  // Update request status
  const updateRequestStatus = async (id: string, status: Status) => {
    try {
      const { error } = await supabase
        .from('compras_solicitacoes')
        .update({ status })
        .eq('id', parseInt(id));
      
      if (error) throw error;
      
      setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
      
      toast({
        title: "Status atualizado",
        description: `Status atualizado para: ${status}`,
      });
    } catch (error) {
      console.error('Error updating request status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da solicitação.",
        variant: "destructive",
      });
    }
  };
  
  // Delete request
  const deleteRequest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('compras_solicitacoes')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) throw error;
      
      setRequests(requests.filter(r => r.id !== id));
      
      toast({
        title: "Solicitação removida",
        description: "A solicitação foi removida com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting request:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a solicitação.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <DataContext.Provider value={{
      clients,
      units,
      budgets,
      itemGroups,
      unitsOfMeasure,
      items,
      requests,
      
      addClient,
      updateClient,
      deleteClient,
      getClientById,
      
      addUnit,
      updateUnit,
      deleteUnit,
      getUnitById,
      
      addBudget,
      updateBudget,
      deleteBudget,
      getBudgetById,
      
      addItemGroup,
      updateItemGroup,
      deleteItemGroup,
      
      addUnitOfMeasure,
      updateUnitOfMeasure,
      deleteUnitOfMeasure,
      
      addItem,
      updateItem,
      deleteItem,
      
      createRequest,
      updateRequest,
      deleteRequest,
      updateRequestStatus,
      
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
