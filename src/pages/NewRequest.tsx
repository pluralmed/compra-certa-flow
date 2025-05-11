import React, { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/context/data/DataContext';
import { Request, Client, Unit, Budget, Item, RequestType, Priority, ItemGroup } from '@/context/data/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Plus, X, Search, ShoppingCart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

// Tipo para item temporário/selecionado
interface TempItem {
  id: string;
  name: string;
  quantity: number;
  unitOfMeasure?: string;
}

const NewRequest = () => {
  const { clients, units, budgets, items: availableItems, itemGroups, createRequest } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [client, setClient] = useState<Client | null>(null);
  const [unit, setUnit] = useState<Unit | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [type, setType] = useState<RequestType>('Compra direta');
  const [justification, setJustification] = useState('');
  const [priority, setPriority] = useState<Priority>('Moderado');
  const [items, setItems] = useState<TempItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationId, setConfirmationId] = useState<string | null>(null);
  
  // Estado para o modal de itens
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<TempItem[]>([]);
  const [tempItems, setTempItems] = useState<TempItem[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  
  useEffect(() => {
    if (showConfirmation && confirmationId) {
      const timer = setTimeout(() => {
        setShowConfirmation(false);
      }, 5000); // Mantém o popup visível por 5 segundos
      
      return () => clearTimeout(timer);
    }
  }, [showConfirmation, confirmationId]);
  
  useEffect(() => {
    // Inicializa tempItems com os itens já selecionados quando o modal é aberto
    if (isItemModalOpen) {
      setTempItems([...items]);
      setSelectedGroupId(''); // Reset da seleção do grupo quando abre o modal
    } else {
      // Ao fechar o modal, garantir que selectedGroupId nunca fique undefined ou null
      setSelectedGroupId('');
    }
  }, [isItemModalOpen, items]);
  
  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };
  
  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return;
    
    setTempItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  const handleAddTempItem = (item: Item) => {
    const existingItem = tempItems.find(i => i.id === item.id);
    
    if (existingItem) {
      // Se o item já existe, apenas atualize a quantidade
      setTempItems(prevItems => 
        prevItems.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      // Se o item não existe, adicione-o
      setTempItems([
        ...tempItems, 
        { 
          id: item.id, 
          name: item.name, 
          quantity: 1,
          unitOfMeasure: item.unitOfMeasure.abbreviation
        }
      ]);
    }
  };
  
  const handleRemoveTempItem = (id: string) => {
    setTempItems(tempItems.filter(item => item.id !== id));
  };
  
  const confirmItemSelection = () => {
    setItems(tempItems);
    setIsItemModalOpen(false);
    setSelectedGroupId(''); // Reset da seleção do grupo
  };
  
  // Para a requisição, precisamos manter apenas id, quantity e itemId
  const mapItemsForRequest = (items: TempItem[]) => {
    return items.map(item => ({
      id: '',  // Será gerado pelo banco
      itemId: item.id,
      quantity: item.quantity
    }));
  };
  
  // Filtra itens por termo de busca e grupo selecionado
  const filteredItems = availableItems.filter(item => {
    const matchesSearchTerm = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    // Se nenhum grupo for selecionado, retorna todos que correspondem ao termo de busca
    if (!selectedGroupId) return matchesSearchTerm;
    // Se um grupo for selecionado, filtra por grupo além do termo de busca
    return matchesSearchTerm && item.group.id === selectedGroupId;
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!client || !unit || !budget || !user?.id) {
        toast({
          title: "Erro",
          description: "Preencha todos os campos obrigatórios.",
          variant: "destructive",
        });
        return;
      }

      if (!justification.trim()) {
        toast({
          title: "Erro",
          description: "A justificativa é obrigatória.",
          variant: "destructive",
        });
        return;
      }

      if (items.length === 0) {
        toast({
          title: "Erro",
          description: "Adicione pelo menos um item à solicitação.",
          variant: "destructive",
        });
        return;
      }

      const invalidItems = items.filter(item => item.quantity <= 0);
      if (invalidItems.length > 0) {
        toast({
          title: "Erro",
          description: "Todos os itens devem ter quantidade maior que zero.",
          variant: "destructive",
        });
        return;
      }
      
      const requestData: Omit<Request, 'id' | 'createdAt' | 'status'> = {
        clientId: client.id,
        unitId: unit.id,
        type,
        justification: justification.trim(),
        budgetId: budget.id,
        priority,
        userId: user.id,
        items: mapItemsForRequest(items)
      };
      
      const requestId = await createRequest(requestData);
      setConfirmationId(requestId);
      setShowConfirmation(true);
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar a solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Função para resetar o formulário
  const resetForm = () => {
    setClient(null);
    setUnit(null);
    setBudget(null);
    setType('Compra direta');
    setJustification('');
    setPriority('Moderado');
    setItems([]);
    setIsSubmitting(false);
    setConfirmationId(null);
  };
  
  // Manipular o fechamento do modal
  const handleCloseConfirmation = (open: boolean) => {
    setShowConfirmation(open);
    
    // Se o modal foi fechado (open === false) e temos um ID de confirmação
    if (!open && confirmationId) {
      resetForm();
      navigate('/'); // Redirecionando para a rota principal (Dashboard)
    }
  };
  
  // Função para formatar o nome do item com a unidade de medida
  const formatItemName = (name: string, unitOfMeasure?: string): ReactNode => {
    if (!unitOfMeasure) return name;
    
    return (
      <>
        {name} <span className="text-muted-foreground text-xs">({unitOfMeasure})</span>
      </>
    );
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nova Solicitação</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para criar uma nova solicitação de compra.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client">Cliente</Label>
              <Select onValueChange={(value) => setClient(clients.find(c => c.id === value) || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="unit">Unidade</Label>
              <Select onValueChange={(value) => setUnit(units.find(u => u.id === value) || null)} disabled={!client}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  {units.filter(unit => unit.clientId === client?.id).map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="budget">Rubrica</Label>
            <Select onValueChange={(value) => setBudget(budgets.find(b => b.id === value) || null)} disabled={!client}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a rubrica" />
              </SelectTrigger>
              <SelectContent>
                {budgets.filter(budget => budget.clientId === client?.id).map((budget) => (
                  <SelectItem key={budget.id} value={budget.id}>{budget.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="type">Tipo de Solicitação</Label>
            <Select onValueChange={(value: RequestType) => setType(value)} defaultValue="Compra direta">
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Compra direta">Compra direta</SelectItem>
                <SelectItem value="Cotação">Cotação</SelectItem>
                <SelectItem value="Serviço">Serviço</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="justification">Justificativa</Label>
            <Textarea
              id="justification"
              placeholder="Descreva a necessidade desta solicitação"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="priority">Prioridade</Label>
            <Select onValueChange={(value: Priority) => setPriority(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Moderado">Moderado</SelectItem>
                <SelectItem value="Urgente">Urgente</SelectItem>
                <SelectItem value="Emergencial">Emergencial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Itens selecionados */}
          {items.length > 0 && (
            <div className="mt-4">
              <Label>Itens Selecionados</Label>
              <div className="mt-2 border border-teal-300 rounded-md p-3 bg-teal-50">
                <ul className="space-y-2">
                  {items.map((item, index) => (
                    <li key={index} className="flex items-center justify-between p-2 bg-white border border-teal-200 rounded-md">
                      <span>
                        {formatItemName(item.name, item.unitOfMeasure)} - 
                        Quantidade: {item.quantity}
                      </span>
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Botão de adicionar itens */}
          <div className="pt-2">
            <Button 
              type="button" 
              variant={items.length > 0 ? "outline" : "default"}
              className={`w-full ${items.length === 0 ? "bg-teal hover:bg-teal/90" : "border-teal text-teal hover:bg-teal/10"}`}
              onClick={() => setIsItemModalOpen(true)}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {items.length > 0 ? 'Gerenciar Itens' : 'Adicionar Itens'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
      </Button>
      
      {/* Modal de confirmação */}
      <Dialog open={showConfirmation} onOpenChange={handleCloseConfirmation}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Solicitação enviada!</DialogTitle>
            <DialogDescription>
              Sua solicitação foi enviada com sucesso. Você será contactado em breve.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      
      {/* Modal de seleção de itens */}
      <Dialog open={isItemModalOpen} onOpenChange={setIsItemModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Adicionar Itens</DialogTitle>
            <DialogDescription>
              Busque e selecione os itens para sua solicitação
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Barra de busca */}
            <div className="flex items-center relative">
              <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar item..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Lista de grupos */}
            <div>
              <Label htmlFor="group">Grupo</Label>
              <Select 
                value={selectedGroupId} 
                onValueChange={(value) => setSelectedGroupId(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os grupos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os grupos</SelectItem>
                  {itemGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Lista de itens disponíveis */}
            <div className="grid grid-cols-1 gap-2">
              <h4 className="text-sm font-medium">Itens Disponíveis</h4>
              <ScrollArea className="h-[200px] rounded-md border border-gray-300 shadow-sm bg-white p-2">
                {filteredItems.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">Nenhum item encontrado</p>
                ) : (
                  <div className="space-y-2">
                    {filteredItems.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md border border-gray-200"
                      >
                        <span>
                          {item.name} <span className="text-muted-foreground text-xs">({item.unitOfMeasure.abbreviation})</span>
                        </span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleAddTempItem(item)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
            
            {/* Itens selecionados temporariamente */}
            <div className="grid grid-cols-1 gap-2">
              <h4 className="text-sm font-medium">Itens Selecionados</h4>
              {tempItems.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground border rounded-md">Nenhum item selecionado</p>
              ) : (
                <ScrollArea className="h-[200px] rounded-md border border-teal-300 shadow-sm bg-teal-50 p-2">
                  <div className="space-y-2">
                    {tempItems.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between p-2 bg-white border border-teal-200 hover:bg-teal-50 rounded-md"
                      >
                        <span>{formatItemName(item.name, item.unitOfMeasure)}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border rounded-md bg-white">
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <span>-</span>
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              <span>+</span>
                            </Button>
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveTempItem(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              setIsItemModalOpen(false);
              setSelectedGroupId('');
            }}>
              Cancelar
            </Button>
            <Button type="button" onClick={confirmItemSelection}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default NewRequest;
