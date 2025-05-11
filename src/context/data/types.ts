// Define types for our data models
export type RequestType = 'Compra direta' | 'Cotação' | 'Serviço';
export type Status = 
  | 'Aguardando liberação' 
  | 'Em cotação' 
  | 'Aguardando pagamento' 
  | 'Pagamento realizado' 
  | 'Aguardando entrega' 
  | 'Entregue'
  | 'Liberada' 
  | 'Em análise' 
  | 'Concluída' 
  | 'Recusada' 
  | 'Solicitação rejeitada';
  
export type Priority = 
  | 'Moderado'
  | 'Urgente'
  | 'Emergencial';

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

export interface StatusHistoryItem {
  id: string;
  status: Status;
  createdAt: string;
  userId: string;
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
  statusHistory?: StatusHistoryItem[];
  justificationRejection?: string; // Added field for rejection justification
}

// Add User interface export that was missing
export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  whatsapp: string;
  sector: string;
  role: 'admin' | 'normal';
  status: 'ativo' | 'inativo';
}

export interface DataContextProps {
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
  updateRequestStatus: (id: string, status: Status, userId: string) => void;
  getRequestById: (id: string) => Request | undefined;
  
  // Loading states
  loading: boolean;
  fetched: boolean;
}
