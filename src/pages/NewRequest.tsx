import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData, Priority, RequestType } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Trash2,
  CheckCircle
} from 'lucide-react';
import { formatCurrency } from '@/utils/format';

const NewRequest = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    clients, 
    units, 
    budgets, 
    items, 
    createRequest,
    getUnitsByClientId,
    getBudgetsByClientId
  } = useData();
  
  // Form states
  const [clientId, setClientId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [requestType, setRequestType] = useState<RequestType>('Compra direta');
  const [justification, setJustification] = useState('');
  const [budgetId, setBudgetId] = useState('');
  const [priority, setPriority] = useState<Priority>('Moderada');
  const [requestItems, setRequestItems] = useState<Array<{id: string, itemId: string, quantity: number}>>([]);
  
  // Filtered options based on selections
  const [availableUnits, setAvailableUnits] = useState(units);
  const [availableBudgets, setAvailableBudgets] = useState(budgets);
  
  // Item selection dialog states
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState('1');
  
  // Success dialog state
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [newRequestId, setNewRequestId] = useState('');
  
  // Update available units when client changes
  useEffect(() => {
    if (clientId) {
      const filteredUnits = getUnitsByClientId(clientId);
      setAvailableUnits(filteredUnits);
      
      if (filteredUnits.length > 0 && !filteredUnits.find(u => u.id === unitId)) {
        setUnitId('');
      }
      
      const filteredBudgets = getBudgetsByClientId(clientId);
      setAvailableBudgets(filteredBudgets);
      
      if (filteredBudgets.length > 0 && !filteredBudgets.find(b => b.id === budgetId)) {
        setBudgetId('');
      }
    } else {
      setAvailableUnits([]);
      setAvailableBudgets([]);
      setUnitId('');
      setBudgetId('');
    }
  }, [clientId, getUnitsByClientId, getBudgetsByClientId, unitId, budgetId]);
  
  // Filter items based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(items);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = items.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.group.toLowerCase().includes(query)
    );
    
    setFilteredItems(filtered);
  }, [searchQuery, items]);
  
  // Handle item selection
  const handleSelectItem = (itemId: string) => {
    setSelectedItemId(itemId);
  };
  
  // Add item to request
  const handleAddItemToRequest = () => {
    if (!selectedItemId) return;
    
    // Check if the item is already added
    const existingItem = requestItems.find(item => item.itemId === selectedItemId);
    
    if (existingItem) {
      // Update quantity of existing item
      setRequestItems(requestItems.map(item => 
        item.itemId === selectedItemId 
          ? { ...item, quantity: item.quantity + parseInt(quantity) } 
          : item
      ));
    } else {
      // Add new item
      setRequestItems([
        ...requestItems, 
        { 
          id: Date.now().toString(),
          itemId: selectedItemId, 
          quantity: parseInt(quantity) 
        }
      ]);
    }
    
    // Reset selection state
    setSelectedItemId('');
    setQuantity('1');
    setSearchQuery('');
    setIsAddItemOpen(false);
  };
  
  // Remove item from request
  const handleRemoveItem = (id: string) => {
    setRequestItems(requestItems.filter(item => item.id !== id));
  };
  
  // Submit request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (requestItems.length === 0) {
      alert('Por favor, adicione pelo menos um item à solicitação.');
      return;
    }
    
    try {
      const requestId = await createRequest({
        clientId,
        unitId,
        type: requestType,
        justification,
        budgetId,
        priority,
        userId: user!.id,
        items: requestItems,
      });
      
      setNewRequestId(requestId);
      setIsSuccessOpen(true);
    } catch (error) {
      console.error("Error creating request:", error);
    }
  };
  
  // Reset form
  const resetForm = () => {
    setClientId('');
    setUnitId('');
    setRequestType('Compra direta');
    setJustification('');
    setBudgetId('');
    setPriority('Moderada');
    setRequestItems([]);
  };
  
  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Nova Solicitação</h2>
            <p className="text-muted-foreground">
              Preencha os dados para criar uma nova solicitação de compra ou serviço
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Solicitação</CardTitle>
              <CardDescription>
                Preencha os dados básicos da solicitação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Cliente</Label>
                  <Select value={clientId} onValueChange={setClientId} required>
                    <SelectTrigger id="client">
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unidade</Label>
                  <Select 
                    value={unitId} 
                    onValueChange={setUnitId}
                    disabled={!clientId || availableUnits.length === 0}
                    required
                  >
                    <SelectTrigger id="unit">
                      <SelectValue placeholder={
                        !clientId 
                          ? "Selecione o cliente primeiro" 
                          : availableUnits.length === 0 
                            ? "Nenhuma unidade disponível" 
                            : "Selecione a unidade"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUnits.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requestType">Tipo de Solicitação</Label>
                  <Select 
                    value={requestType} 
                    onValueChange={(value: RequestType) => setRequestType(value)}
                    required
                  >
                    <SelectTrigger id="requestType">
                      <SelectValue placeholder="Selecione o tipo de solicitação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Compra direta">Compra direta</SelectItem>
                      <SelectItem value="Cotação">Cotação</SelectItem>
                      <SelectItem value="Serviço">Serviço</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select 
                    value={priority} 
                    onValueChange={(value: Priority) => setPriority(value)}
                    required
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Moderada">Moderada</SelectItem>
                      <SelectItem value="Urgente">Urgente</SelectItem>
                      <SelectItem value="Emergencial">Emergencial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget">Rubrica</Label>
                <Select 
                  value={budgetId} 
                  onValueChange={setBudgetId}
                  disabled={!clientId || availableBudgets.length === 0}
                  required
                >
                  <SelectTrigger id="budget">
                    <SelectValue placeholder={
                      !clientId 
                        ? "Selecione o cliente primeiro" 
                        : availableBudgets.length === 0 
                          ? "Nenhuma rubrica disponível" 
                          : "Selecione a rubrica"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBudgets.map((budget) => (
                      <SelectItem key={budget.id} value={budget.id}>
                        {budget.name} ({formatCurrency(budget.monthlyAmount)} mensal)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="justification">Justificativa</Label>
                <Textarea 
                  id="justification" 
                  value={justification} 
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Descreva a justificativa para esta solicitação"
                  required
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Solicitante</Label>
                <div className="p-3 border rounded-lg bg-muted/50">
                  {user?.name} {user?.lastName} ({user?.sector})
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Itens da Solicitação</CardTitle>
                <CardDescription>
                  Adicione os itens que deseja solicitar
                </CardDescription>
              </div>
              <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-teal hover:bg-teal/90">
                    <Plus size={16} className="mr-2" />
                    Adicionar Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Adicionar Item à Solicitação</DialogTitle>
                    <DialogDescription>
                      Pesquise e selecione um item para adicionar
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Pesquisar item por nome ou grupo..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="border rounded-md h-64 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Item</TableHead>
                            <TableHead>Grupo</TableHead>
                            <TableHead>Unidade</TableHead>
                            <TableHead>Preço Médio</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                              <TableRow 
                                key={item.id} 
                                className={`cursor-pointer ${selectedItemId === item.id ? 'bg-blue/10' : ''}`}
                                onClick={() => handleSelectItem(item.id)}
                              >
                                <TableCell className="p-2">
                                  <div className={`h-4 w-4 rounded-full border border-primary ${
                                    selectedItemId === item.id ? 'bg-primary' : ''
                                  }`} />
                                </TableCell>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.group}</TableCell>
                                <TableCell>{item.unitOfMeasure}</TableCell>
                                <TableCell>{formatCurrency(item.averagePrice)}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                Nenhum item encontrado
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="flex items-end gap-4">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="quantity">Quantidade</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddItemOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleAddItemToRequest}
                      disabled={!selectedItemId || parseInt(quantity) < 1}
                      className="bg-teal hover:bg-teal/90"
                    >
                      Adicionar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Grupo</TableHead>
                      <TableHead className="text-center">Quantidade</TableHead>
                      <TableHead>Unidade</TableHead>
                      <TableHead>Preço Unitário</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requestItems.length > 0 ? (
                      requestItems.map((requestItem) => {
                        const item = items.find(i => i.id === requestItem.itemId);
                        if (!item) return null;
                        
                        const total = item.averagePrice * requestItem.quantity;
                        
                        return (
                          <TableRow key={requestItem.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.group}</TableCell>
                            <TableCell className="text-center">{requestItem.quantity}</TableCell>
                            <TableCell>{item.unitOfMeasure}</TableCell>
                            <TableCell>{formatCurrency(item.averagePrice)}</TableCell>
                            <TableCell>{formatCurrency(total)}</TableCell>
                            <TableCell>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8 text-red-500 hover:text-red-700"
                                onClick={() => handleRemoveItem(requestItem.id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell 
                          colSpan={7} 
                          className="text-center py-6 text-muted-foreground"
                        >
                          Nenhum item adicionado à solicitação
                        </TableCell>
                      </TableRow>
                    )}
                    
                    {requestItems.length > 0 && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={5} className="text-right font-medium">
                          Total da Solicitação:
                        </TableCell>
                        <TableCell className="font-bold">
                          {formatCurrency(
                            requestItems.reduce((total, requestItem) => {
                              const item = items.find(i => i.id === requestItem.itemId);
                              if (!item) return total;
                              return total + (item.averagePrice * requestItem.quantity);
                            }, 0)
                          )}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={resetForm}
            >
              Limpar
            </Button>
            <Button 
              type="submit"
              className="bg-teal hover:bg-teal/90"
              disabled={requestItems.length === 0}
            >
              Finalizar Solicitação
            </Button>
          </div>
        </form>
      </div>
      
      {/* Success Dialog */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center py-4">
            <CheckCircle size={60} className="text-green-500 mb-4" />
            <DialogTitle className="text-xl text-center mb-2">
              ✅ Sua solicitação foi criada!
            </DialogTitle>
            <DialogDescription className="text-center mb-6">
              Entraremos em contato em breve com atualizações sobre o progresso da sua solicitação.
            </DialogDescription>
            <Button 
              className="bg-teal hover:bg-teal/90 w-full" 
              onClick={() => {
                setIsSuccessOpen(false);
                navigate('/minhas-solicitacoes');
              }}
            >
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewRequest;
