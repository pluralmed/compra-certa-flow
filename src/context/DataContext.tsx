import React, { createContext, useContext, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

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

// Mock Data
const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Hospital Regional', municipality: 'São Paulo' },
  { id: '2', name: 'UBS Central', municipality: 'Campinas' },
  { id: '3', name: 'Centro de Saúde', municipality: 'Ribeirão Preto' },
];

const MOCK_UNITS: Unit[] = [
  { id: '1', name: 'Unidade Principal', clientId: '1' },
  { id: '2', name: 'Anexo Administrativo', clientId: '1' },
  { id: '3', name: 'UBS Centro', clientId: '2' },
  { id: '4', name: 'UBS Jardim América', clientId: '2' },
  { id: '5', name: 'Centro de Especialidades', clientId: '3' },
];

const MOCK_BUDGETS: Budget[] = [
  { id: '1', name: 'Coleta de resíduos', clientId: '1', monthlyAmount: 5000 },
  { id: '2', name: 'Dedetização', clientId: '1', monthlyAmount: 1500 },
  { id: '3', name: 'Investimentos', clientId: '1', monthlyAmount: 10000 },
  { id: '4', name: 'Manutenção', clientId: '2', monthlyAmount: 3000 },
  { id: '5', name: 'Equipamentos', clientId: '2', monthlyAmount: 7000 },
  { id: '6', name: 'Materiais', clientId: '3', monthlyAmount: 4000 },
];

const MOCK_ITEMS: Item[] = [
  { id: '1', group: 'Materiais', name: 'Caneta esferográfica', unitOfMeasure: 'CX', averagePrice: 25.50 },
  { id: '2', group: 'Equipamentos', name: 'Monitor LED 24"', unitOfMeasure: 'UN', averagePrice: 850.00 },
  { id: '3', group: 'Materiais', name: 'Papel A4', unitOfMeasure: 'CX', averagePrice: 189.90 },
  { id: '4', group: 'Serviços', name: 'Manutenção de ar-condicionado', unitOfMeasure: 'UN', averagePrice: 250.00 },
  { id: '5', group: 'Equipamentos', name: 'Notebook', unitOfMeasure: 'UN', averagePrice: 3500.00 },
];

const MOCK_REQUESTS: Request[] = [
  {
    id: '1',
    clientId: '1',
    unitId: '1',
    type: 'Compra direta',
    justification: 'Reposição de material de escritório',
    budgetId: '1',
    priority: 'Moderada',
    userId: '2',
    createdAt: '2023-05-10T14:30:00Z',
    status: 'Aguardando liberação',
    items: [
      { id: '1', itemId: '1', quantity: 2 },
      { id: '2', itemId: '3', quantity: 5 },
    ],
  },
  {
    id: '2',
    clientId: '2',
    unitId: '3',
    type: 'Cotação',
    justification: 'Aquisição de novos equipamentos',
    budgetId: '5',
    priority: 'Urgente',
    userId: '2',
    createdAt: '2023-05-12T09:15:00Z',
    status: 'Em cotação',
    items: [
      { id: '3', itemId: '2', quantity: 3 },
      { id: '4', itemId: '5', quantity: 1 },
    ],
  },
];

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
  createRequest: (request: Omit<Request, 'id' | 'createdAt' | 'status'>) => string;
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
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [units, setUnits] = useState<Unit[]>(MOCK_UNITS);
  const [budgets, setBudgets] = useState<Budget[]>(MOCK_BUDGETS);
  const [items, setItems] = useState<Item[]>(MOCK_ITEMS);
  const [requests, setRequests] = useState<Request[]>(MOCK_REQUESTS);

  const { toast } = useToast();

  // Client functions
  const addClient = (client: Omit<Client, 'id'>) => {
    const id = (clients.length + 1).toString();
    const newClient = { ...client, id };
    setClients([...clients, newClient]);
    toast({
      title: "Cliente adicionado",
      description: `${client.name} foi adicionado com sucesso.`,
    });
  };

  const updateClient = (client: Client) => {
    setClients(clients.map(c => c.id === client.id ? client : c));
    toast({
      title: "Cliente atualizado",
      description: `${client.name} foi atualizado com sucesso.`,
    });
  };

  const deleteClient = (id: string) => {
    const clientToDelete = clients.find(c => c.id === id);
    setClients(clients.filter(c => c.id !== id));
    if (clientToDelete) {
      toast({
        title: "Cliente removido",
        description: `${clientToDelete.name} foi removido com sucesso.`,
      });
    }
  };

  // Unit functions
  const addUnit = (unit: Omit<Unit, 'id'>) => {
    const id = (units.length + 1).toString();
    const newUnit = { ...unit, id };
    setUnits([...units, newUnit]);
    toast({
      title: "Unidade adicionada",
      description: `${unit.name} foi adicionada com sucesso.`,
    });
  };

  const updateUnit = (unit: Unit) => {
    setUnits(units.map(u => u.id === unit.id ? unit : u));
    toast({
      title: "Unidade atualizada",
      description: `${unit.name} foi atualizada com sucesso.`,
    });
  };

  const deleteUnit = (id: string) => {
    const unitToDelete = units.find(u => u.id === id);
    setUnits(units.filter(u => u.id !== id));
    if (unitToDelete) {
      toast({
        title: "Unidade removida",
        description: `${unitToDelete.name} foi removida com sucesso.`,
      });
    }
  };

  // Budget functions
  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const id = (budgets.length + 1).toString();
    const newBudget = { ...budget, id };
    setBudgets([...budgets, newBudget]);
    toast({
      title: "Rubrica adicionada",
      description: `${budget.name} foi adicionada com sucesso.`,
    });
  };

  const updateBudget = (budget: Budget) => {
    setBudgets(budgets.map(b => b.id === budget.id ? budget : b));
    toast({
      title: "Rubrica atualizada",
      description: `${budget.name} foi atualizada com sucesso.`,
    });
  };

  const deleteBudget = (id: string) => {
    const budgetToDelete = budgets.find(b => b.id === id);
    setBudgets(budgets.filter(b => b.id !== id));
    if (budgetToDelete) {
      toast({
        title: "Rubrica removida",
        description: `${budgetToDelete.name} foi removida com sucesso.`,
      });
    }
  };

  // Item functions
  const addItem = (item: Omit<Item, 'id'>) => {
    const id = (items.length + 1).toString();
    const newItem = { ...item, id };
    setItems([...items, newItem]);
    toast({
      title: "Item adicionado",
      description: `${item.name} foi adicionado com sucesso.`,
    });
  };

  const updateItem = (item: Item) => {
    setItems(items.map(i => i.id === item.id ? item : i));
    toast({
      title: "Item atualizado",
      description: `${item.name} foi atualizado com sucesso.`,
    });
  };

  const deleteItem = (id: string) => {
    const itemToDelete = items.find(i => i.id === id);
    setItems(items.filter(i => i.id !== id));
    if (itemToDelete) {
      toast({
        title: "Item removido",
        description: `${itemToDelete.name} foi removido com sucesso.`,
      });
    }
  };

  // Request functions
  const createRequest = (request: Omit<Request, 'id' | 'createdAt' | 'status'>) => {
    const id = (requests.length + 1).toString();
    const newRequest = {
      ...request,
      id,
      createdAt: new Date().toISOString(),
      status: 'Aguardando liberação' as Status,
    };
    setRequests([...requests, newRequest]);
    toast({
      title: "✅ Solicitação criada!",
      description: "Entraremos em contato em breve.",
    });
    return id;
  };

  const updateRequest = (request: Request) => {
    setRequests(requests.map(r => r.id === request.id ? request : r));
    toast({
      title: "Solicitação atualizada",
      description: `A solicitação #${request.id} foi atualizada.`,
    });
  };

  const updateRequestStatus = (id: string, status: Status) => {
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
