
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Settings = () => {
  const { user } = useAuth();
  const { 
    clients, 
    units, 
    budgets,
    items,
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
    getClientById,
  } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('clients');
  
  // Dialog states
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [isDeleteClientOpen, setIsDeleteClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  const [isEditUnitOpen, setIsEditUnitOpen] = useState(false);
  const [isDeleteUnitOpen, setIsDeleteUnitOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);
  const [isDeleteBudgetOpen, setIsDeleteBudgetOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<any>(null);
  
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [isDeleteItemOpen, setIsDeleteItemOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // Form states
  const [clientName, setClientName] = useState('');
  const [clientMunicipality, setClientMunicipality] = useState('');
  
  const [unitName, setUnitName] = useState('');
  const [unitClientId, setUnitClientId] = useState('');
  
  const [budgetName, setBudgetName] = useState('');
  const [budgetClientId, setBudgetClientId] = useState('');
  const [budgetMonthlyAmount, setBudgetMonthlyAmount] = useState('');
  
  const [itemGroup, setItemGroup] = useState<'Materiais' | 'Equipamentos' | 'Serviços' | 'Outros'>('Materiais');
  const [itemName, setItemName] = useState('');
  const [itemUnitOfMeasure, setItemUnitOfMeasure] = useState<'UN' | 'CX' | 'KG' | 'L' | 'M' | 'M²' | 'M³' | 'PCT'>('UN');
  const [itemAveragePrice, setItemAveragePrice] = useState('');
  
  // Redirect if not admin
  if (user?.role !== 'admin') {
    navigate('/');
    return null;
  }
  
  const resetClientForm = () => {
    setClientName('');
    setClientMunicipality('');
  };
  
  const resetUnitForm = () => {
    setUnitName('');
    setUnitClientId('');
  };
  
  const resetBudgetForm = () => {
    setBudgetName('');
    setBudgetClientId('');
    setBudgetMonthlyAmount('');
  };
  
  const resetItemForm = () => {
    setItemGroup('Materiais');
    setItemName('');
    setItemUnitOfMeasure('UN');
    setItemAveragePrice('');
  };
  
  // Client handlers
  const handleAddClient = () => {
    addClient({
      name: clientName,
      municipality: clientMunicipality,
    });
    resetClientForm();
    setIsAddClientOpen(false);
  };
  
  const handleUpdateClient = () => {
    if (!selectedClient) return;
    updateClient({
      ...selectedClient,
      name: clientName,
      municipality: clientMunicipality,
    });
    resetClientForm();
    setIsEditClientOpen(false);
  };
  
  const handleDeleteClient = () => {
    if (!selectedClient) return;
    deleteClient(selectedClient.id);
    setIsDeleteClientOpen(false);
  };
  
  const openEditClientDialog = (client: any) => {
    setSelectedClient(client);
    setClientName(client.name);
    setClientMunicipality(client.municipality);
    setIsEditClientOpen(true);
  };
  
  const openDeleteClientDialog = (client: any) => {
    setSelectedClient(client);
    setIsDeleteClientOpen(true);
  };
  
  // Unit handlers
  const handleAddUnit = () => {
    addUnit({
      name: unitName,
      clientId: unitClientId,
    });
    resetUnitForm();
    setIsAddUnitOpen(false);
  };
  
  const handleUpdateUnit = () => {
    if (!selectedUnit) return;
    updateUnit({
      ...selectedUnit,
      name: unitName,
      clientId: unitClientId,
    });
    resetUnitForm();
    setIsEditUnitOpen(false);
  };
  
  const handleDeleteUnit = () => {
    if (!selectedUnit) return;
    deleteUnit(selectedUnit.id);
    setIsDeleteUnitOpen(false);
  };
  
  const openEditUnitDialog = (unit: any) => {
    setSelectedUnit(unit);
    setUnitName(unit.name);
    setUnitClientId(unit.clientId);
    setIsEditUnitOpen(true);
  };
  
  const openDeleteUnitDialog = (unit: any) => {
    setSelectedUnit(unit);
    setIsDeleteUnitOpen(true);
  };
  
  // Budget handlers
  const handleAddBudget = () => {
    addBudget({
      name: budgetName,
      clientId: budgetClientId,
      monthlyAmount: parseFloat(budgetMonthlyAmount),
    });
    resetBudgetForm();
    setIsAddBudgetOpen(false);
  };
  
  const handleUpdateBudget = () => {
    if (!selectedBudget) return;
    updateBudget({
      ...selectedBudget,
      name: budgetName,
      clientId: budgetClientId,
      monthlyAmount: parseFloat(budgetMonthlyAmount),
    });
    resetBudgetForm();
    setIsEditBudgetOpen(false);
  };
  
  const handleDeleteBudget = () => {
    if (!selectedBudget) return;
    deleteBudget(selectedBudget.id);
    setIsDeleteBudgetOpen(false);
  };
  
  const openEditBudgetDialog = (budget: any) => {
    setSelectedBudget(budget);
    setBudgetName(budget.name);
    setBudgetClientId(budget.clientId);
    setBudgetMonthlyAmount(budget.monthlyAmount.toString());
    setIsEditBudgetOpen(true);
  };
  
  const openDeleteBudgetDialog = (budget: any) => {
    setSelectedBudget(budget);
    setIsDeleteBudgetOpen(true);
  };
  
  // Item handlers
  const handleAddItem = () => {
    addItem({
      group: itemGroup,
      name: itemName,
      unitOfMeasure: itemUnitOfMeasure,
      averagePrice: parseFloat(itemAveragePrice),
    });
    resetItemForm();
    setIsAddItemOpen(false);
  };
  
  const handleUpdateItem = () => {
    if (!selectedItem) return;
    updateItem({
      ...selectedItem,
      group: itemGroup,
      name: itemName,
      unitOfMeasure: itemUnitOfMeasure,
      averagePrice: parseFloat(itemAveragePrice),
    });
    resetItemForm();
    setIsEditItemOpen(false);
  };
  
  const handleDeleteItem = () => {
    if (!selectedItem) return;
    deleteItem(selectedItem.id);
    setIsDeleteItemOpen(false);
  };
  
  const openEditItemDialog = (item: any) => {
    setSelectedItem(item);
    setItemGroup(item.group);
    setItemName(item.name);
    setItemUnitOfMeasure(item.unitOfMeasure);
    setItemAveragePrice(item.averagePrice.toString());
    setIsEditItemOpen(true);
  };
  
  const openDeleteItemDialog = (item: any) => {
    setSelectedItem(item);
    setIsDeleteItemOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configurações do Sistema</h2>
        <p className="text-muted-foreground">
          Gerencie os dados do sistema
        </p>
      </div>
      
      {/* Tabs for different settings */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="units">Unidades</TabsTrigger>
          <TabsTrigger value="budgets">Rubricas</TabsTrigger>
          <TabsTrigger value="items">Itens</TabsTrigger>
        </TabsList>
        
        {/* Clients Tab */}
        <TabsContent value="clients" className="p-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Clientes</CardTitle>
                <CardDescription>Gerencie os clientes do sistema</CardDescription>
              </div>
              <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-teal hover:bg-teal/90">
                    <Plus size={16} className="mr-2" />
                    Adicionar Cliente
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Cliente</DialogTitle>
                    <DialogDescription>Preencha os dados para criar um novo cliente</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientName">Nome</Label>
                      <Input 
                        id="clientName" 
                        value={clientName} 
                        onChange={(e) => setClientName(e.target.value)} 
                        placeholder="Nome do cliente"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientMunicipality">Município</Label>
                      <Input 
                        id="clientMunicipality" 
                        value={clientMunicipality} 
                        onChange={(e) => setClientMunicipality(e.target.value)} 
                        placeholder="Município"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddClientOpen(false)}>Cancelar</Button>
                    <Button className="bg-teal hover:bg-teal/90" onClick={handleAddClient}>Adicionar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Município</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map(client => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>{client.municipality}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => openEditClientDialog(client)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => openDeleteClientDialog(client)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {clients.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                          Nenhum cliente encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Units Tab */}
        <TabsContent value="units" className="p-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Unidades</CardTitle>
                <CardDescription>Gerencie as unidades dos clientes</CardDescription>
              </div>
              <Dialog open={isAddUnitOpen} onOpenChange={setIsAddUnitOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-teal hover:bg-teal/90">
                    <Plus size={16} className="mr-2" />
                    Adicionar Unidade
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Unidade</DialogTitle>
                    <DialogDescription>Preencha os dados para criar uma nova unidade</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="unitName">Nome</Label>
                      <Input 
                        id="unitName" 
                        value={unitName} 
                        onChange={(e) => setUnitName(e.target.value)} 
                        placeholder="Nome da unidade"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unitClient">Cliente</Label>
                      <Select value={unitClientId} onValueChange={setUnitClientId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map(client => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddUnitOpen(false)}>Cancelar</Button>
                    <Button className="bg-teal hover:bg-teal/90" onClick={handleAddUnit}>Adicionar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {units.map(unit => {
                      const client = getClientById(unit.clientId);
                      return (
                        <TableRow key={unit.id}>
                          <TableCell className="font-medium">{unit.name}</TableCell>
                          <TableCell>{client?.name || 'Cliente não encontrado'}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => openEditUnitDialog(unit)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => openDeleteUnitDialog(unit)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {units.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                          Nenhuma unidade encontrada.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Budgets Tab */}
        <TabsContent value="budgets" className="p-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Rubricas</CardTitle>
                <CardDescription>Gerencie as rubricas do sistema</CardDescription>
              </div>
              <Dialog open={isAddBudgetOpen} onOpenChange={setIsAddBudgetOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-teal hover:bg-teal/90">
                    <Plus size={16} className="mr-2" />
                    Adicionar Rubrica
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Rubrica</DialogTitle>
                    <DialogDescription>Preencha os dados para criar uma nova rubrica</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="budgetName">Nome</Label>
                      <Input 
                        id="budgetName" 
                        value={budgetName} 
                        onChange={(e) => setBudgetName(e.target.value)} 
                        placeholder="Nome da rubrica"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budgetClient">Cliente</Label>
                      <Select value={budgetClientId} onValueChange={setBudgetClientId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map(client => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budgetMonthlyAmount">Valor Mensal</Label>
                      <Input 
                        id="budgetMonthlyAmount" 
                        value={budgetMonthlyAmount} 
                        onChange={(e) => setBudgetMonthlyAmount(e.target.value)} 
                        placeholder="0,00"
                        type="number"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddBudgetOpen(false)}>Cancelar</Button>
                    <Button className="bg-teal hover:bg-teal/90" onClick={handleAddBudget}>Adicionar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Valor Mensal</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budgets.map(budget => {
                      const client = getClientById(budget.clientId);
                      return (
                        <TableRow key={budget.id}>
                          <TableCell className="font-medium">{budget.name}</TableCell>
                          <TableCell>{client?.name || 'Cliente não encontrado'}</TableCell>
                          <TableCell>{formatCurrency(budget.monthlyAmount)}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => openEditBudgetDialog(budget)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => openDeleteBudgetDialog(budget)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {budgets.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                          Nenhuma rubrica encontrada.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Items Tab */}
        <TabsContent value="items" className="p-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Itens</CardTitle>
                <CardDescription>Gerencie os itens do sistema</CardDescription>
              </div>
              <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-teal hover:bg-teal/90">
                    <Plus size={16} className="mr-2" />
                    Adicionar Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Item</DialogTitle>
                    <DialogDescription>Preencha os dados para criar um novo item</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="itemGroup">Grupo</Label>
                      <Select 
                        value={itemGroup} 
                        onValueChange={(value: 'Materiais' | 'Equipamentos' | 'Serviços' | 'Outros') => 
                          setItemGroup(value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o grupo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Materiais">Materiais</SelectItem>
                          <SelectItem value="Equipamentos">Equipamentos</SelectItem>
                          <SelectItem value="Serviços">Serviços</SelectItem>
                          <SelectItem value="Outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemName">Nome</Label>
                      <Input 
                        id="itemName" 
                        value={itemName} 
                        onChange={(e) => setItemName(e.target.value)} 
                        placeholder="Nome do item"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemUnitOfMeasure">Unidade de Medida</Label>
                      <Select 
                        value={itemUnitOfMeasure} 
                        onValueChange={(value: 'UN' | 'CX' | 'KG' | 'L' | 'M' | 'M²' | 'M³' | 'PCT') => 
                          setItemUnitOfMeasure(value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a unidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UN">UN</SelectItem>
                          <SelectItem value="CX">CX</SelectItem>
                          <SelectItem value="KG">KG</SelectItem>
                          <SelectItem value="L">L</SelectItem>
                          <SelectItem value="M">M</SelectItem>
                          <SelectItem value="M²">M²</SelectItem>
                          <SelectItem value="M³">M³</SelectItem>
                          <SelectItem value="PCT">PCT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemAveragePrice">Preço Médio</Label>
                      <Input 
                        id="itemAveragePrice" 
                        value={itemAveragePrice} 
                        onChange={(e) => setItemAveragePrice(e.target.value)} 
                        placeholder="0,00"
                        type="number"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddItemOpen(false)}>Cancelar</Button>
                    <Button className="bg-teal hover:bg-teal/90" onClick={handleAddItem}>Adicionar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Grupo</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Unidade</TableHead>
                      <TableHead>Preço Médio</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.group}</TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.unitOfMeasure}</TableCell>
                        <TableCell>{formatCurrency(item.averagePrice)}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => openEditItemDialog(item)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => openDeleteItemDialog(item)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {items.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                          Nenhum item encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Edit Client Dialog */}
      <Dialog open={isEditClientOpen} onOpenChange={setIsEditClientOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>Atualize os dados do cliente</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editClientName">Nome</Label>
              <Input 
                id="editClientName" 
                value={clientName} 
                onChange={(e) => setClientName(e.target.value)} 
                placeholder="Nome do cliente"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editClientMunicipality">Município</Label>
              <Input 
                id="editClientMunicipality" 
                value={clientMunicipality} 
                onChange={(e) => setClientMunicipality(e.target.value)} 
                placeholder="Município"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditClientOpen(false)}>Cancelar</Button>
            <Button className="bg-teal hover:bg-teal/90" onClick={handleUpdateClient}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Client Dialog */}
      <AlertDialog open={isDeleteClientOpen} onOpenChange={setIsDeleteClientOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O cliente será removido permanentemente do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDeleteClient}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Edit Unit Dialog */}
      <Dialog open={isEditUnitOpen} onOpenChange={setIsEditUnitOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Unidade</DialogTitle>
            <DialogDescription>Atualize os dados da unidade</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editUnitName">Nome</Label>
              <Input 
                id="editUnitName" 
                value={unitName} 
                onChange={(e) => setUnitName(e.target.value)} 
                placeholder="Nome da unidade"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editUnitClient">Cliente</Label>
              <Select value={unitClientId} onValueChange={setUnitClientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUnitOpen(false)}>Cancelar</Button>
            <Button className="bg-teal hover:bg-teal/90" onClick={handleUpdateUnit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Unit Dialog */}
      <AlertDialog open={isDeleteUnitOpen} onOpenChange={setIsDeleteUnitOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A unidade será removida permanentemente do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDeleteUnit}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Edit Budget Dialog */}
      <Dialog open={isEditBudgetOpen} onOpenChange={setIsEditBudgetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Rubrica</DialogTitle>
            <DialogDescription>Atualize os dados da rubrica</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editBudgetName">Nome</Label>
              <Input 
                id="editBudgetName" 
                value={budgetName} 
                onChange={(e) => setBudgetName(e.target.value)} 
                placeholder="Nome da rubrica"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editBudgetClient">Cliente</Label>
              <Select value={budgetClientId} onValueChange={setBudgetClientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editBudgetMonthlyAmount">Valor Mensal</Label>
              <Input 
                id="editBudgetMonthlyAmount" 
                value={budgetMonthlyAmount} 
                onChange={(e) => setBudgetMonthlyAmount(e.target.value)} 
                placeholder="0,00"
                type="number"
                step="0.01"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditBudgetOpen(false)}>Cancelar</Button>
            <Button className="bg-teal hover:bg-teal/90" onClick={handleUpdateBudget}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Budget Dialog */}
      <AlertDialog open={isDeleteBudgetOpen} onOpenChange={setIsDeleteBudgetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A rubrica será removida permanentemente do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDeleteBudget}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Edit Item Dialog */}
      <Dialog open={isEditItemOpen} onOpenChange={setIsEditItemOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Item</DialogTitle>
            <DialogDescription>Atualize os dados do item</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editItemGroup">Grupo</Label>
              <Select 
                value={itemGroup} 
                onValueChange={(value: 'Materiais' | 'Equipamentos' | 'Serviços' | 'Outros') => 
                  setItemGroup(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Materiais">Materiais</SelectItem>
                  <SelectItem value="Equipamentos">Equipamentos</SelectItem>
                  <SelectItem value="Serviços">Serviços</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editItemName">Nome</Label>
              <Input 
                id="editItemName" 
                value={itemName} 
                onChange={(e) => setItemName(e.target.value)} 
                placeholder="Nome do item"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editItemUnitOfMeasure">Unidade de Medida</Label>
              <Select 
                value={itemUnitOfMeasure} 
                onValueChange={(value: 'UN' | 'CX' | 'KG' | 'L' | 'M' | 'M²' | 'M³' | 'PCT') => 
                  setItemUnitOfMeasure(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UN">UN</SelectItem>
                  <SelectItem value="CX">CX</SelectItem>
                  <SelectItem value="KG">KG</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="M²">M²</SelectItem>
                  <SelectItem value="M³">M³</SelectItem>
                  <SelectItem value="PCT">PCT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editItemAveragePrice">Preço Médio</Label>
              <Input 
                id="editItemAveragePrice" 
                value={itemAveragePrice} 
                onChange={(e) => setItemAveragePrice(e.target.value)} 
                placeholder="0,00"
                type="number"
                step="0.01"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditItemOpen(false)}>Cancelar</Button>
            <Button className="bg-teal hover:bg-teal/90" onClick={handleUpdateItem}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Item Dialog */}
      <AlertDialog open={isDeleteItemOpen} onOpenChange={setIsDeleteItemOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O item será removido permanentemente do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDeleteItem}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
