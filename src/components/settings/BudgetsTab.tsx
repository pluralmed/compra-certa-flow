import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '@/utils/format';

interface BudgetsTabProps {
  budgets: any[];
  clients: any[];
  addBudget: (budget: any) => void;
  updateBudget: (budget: any) => void;
  deleteBudget: (budgetId: string) => void;
  getClientById: (clientId: string) => any;
}

const BudgetsTab: React.FC<BudgetsTabProps> = ({
  budgets,
  clients,
  addBudget,
  updateBudget,
  deleteBudget,
  getClientById,
}) => {
  // Dialog states
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);
  const [isDeleteBudgetOpen, setIsDeleteBudgetOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<any>(null);
  
  // Form states
  const [budgetName, setBudgetName] = useState('');
  const [budgetClientId, setBudgetClientId] = useState('');
  const [budgetMonthlyAmount, setBudgetMonthlyAmount] = useState('');
  
  // Estado de busca
  const [termoBusca, setTermoBusca] = useState('');
  const [rubricasFiltradas, setRubricasFiltradas] = useState(budgets);
  
  // Estados de paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const ITENS_POR_PAGINA = 5;
  const totalPaginas = Math.ceil(rubricasFiltradas.length / ITENS_POR_PAGINA);
  
  // Atualizar rubricas filtradas quando a busca mudar
  useEffect(() => {
    if (!termoBusca.trim()) {
      setRubricasFiltradas(budgets);
    } else {
      const termoLowerCase = termoBusca.toLowerCase();
      const resultado = budgets.filter(budget => {
        const client = getClientById(budget.clientId);
        return budget.name.toLowerCase().includes(termoLowerCase) || 
               (client?.name.toLowerCase().includes(termoLowerCase) || false);
      });
      setRubricasFiltradas(resultado);
    }
    // Volta para a primeira página quando o filtro mudar
    setPaginaAtual(1);
  }, [termoBusca, budgets, getClientById]);
  
  // Rubricas da página atual
  const rubricasPaginadas = rubricasFiltradas.slice(
    (paginaAtual - 1) * ITENS_POR_PAGINA,
    paginaAtual * ITENS_POR_PAGINA
  );
  
  // Funções de navegação da paginação
  const irParaPaginaAnterior = () => {
    if (paginaAtual > 1) {
      setPaginaAtual(paginaAtual - 1);
    }
  };
  
  const irParaProximaPagina = () => {
    if (paginaAtual < totalPaginas) {
      setPaginaAtual(paginaAtual + 1);
    }
  };
  
  const resetBudgetForm = () => {
    setBudgetName('');
    setBudgetClientId('');
    setBudgetMonthlyAmount('');
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
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Rubricas</CardTitle>
            <CardDescription>Gerencie as rubricas orçamentárias</CardDescription>
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
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar rubricas por nome ou cliente..."
              className="w-full pl-8 bg-white"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </div>

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
                {rubricasPaginadas.map(budget => {
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
                {rubricasFiltradas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                      {termoBusca ? `Nenhuma rubrica encontrada para "${termoBusca}"` : "Nenhuma rubrica encontrada."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {rubricasFiltradas.length > 0 && (
          <CardFooter className="flex items-center justify-between py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Mostrando {rubricasPaginadas.length} de {rubricasFiltradas.length} rubricas
              {budgets.length !== rubricasFiltradas.length && ` (filtradas de ${budgets.length} no total)`}
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={irParaPaginaAnterior}
                disabled={paginaAtual === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="text-sm px-4 py-1 rounded border">
                {paginaAtual} / {totalPaginas || 1}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={irParaProximaPagina}
                disabled={paginaAtual === totalPaginas || totalPaginas === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
      
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
    </>
  );
};

export default BudgetsTab; 