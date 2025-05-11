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

interface UnitsTabProps {
  units: any[];
  clients: any[];
  addUnit: (unit: any) => void;
  updateUnit: (unit: any) => void;
  deleteUnit: (unitId: string) => void;
  getClientById: (clientId: string) => any;
}

const UnitsTab: React.FC<UnitsTabProps> = ({
  units,
  clients,
  addUnit,
  updateUnit,
  deleteUnit,
  getClientById,
}) => {
  // Dialog states
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  const [isEditUnitOpen, setIsEditUnitOpen] = useState(false);
  const [isDeleteUnitOpen, setIsDeleteUnitOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  
  // Form states
  const [unitName, setUnitName] = useState('');
  const [unitClientId, setUnitClientId] = useState('');
  
  // Estado de busca
  const [termoBusca, setTermoBusca] = useState('');
  const [unidadesFiltradas, setUnidadesFiltradas] = useState(units);
  
  // Estados de paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const ITENS_POR_PAGINA = 5;
  const totalPaginas = Math.ceil(unidadesFiltradas.length / ITENS_POR_PAGINA);
  
  // Atualizar unidades filtradas quando a busca mudar
  useEffect(() => {
    if (!termoBusca.trim()) {
      setUnidadesFiltradas(units);
    } else {
      const termoLowerCase = termoBusca.toLowerCase();
      const resultado = units.filter(unit => {
        const client = getClientById(unit.clientId);
        return unit.name.toLowerCase().includes(termoLowerCase) || 
               (client?.name.toLowerCase().includes(termoLowerCase) || false);
      });
      setUnidadesFiltradas(resultado);
    }
    // Volta para a primeira página quando o filtro mudar
    setPaginaAtual(1);
  }, [termoBusca, units, getClientById]);
  
  // Unidades da página atual
  const unidadesPaginadas = unidadesFiltradas.slice(
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
  
  const resetUnitForm = () => {
    setUnitName('');
    setUnitClientId('');
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
  
  return (
    <>
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
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar unidades por nome ou cliente..."
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
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unidadesPaginadas.map(unit => {
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
                {unidadesFiltradas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                      {termoBusca ? `Nenhuma unidade encontrada para "${termoBusca}"` : "Nenhuma unidade encontrada."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {unidadesFiltradas.length > 0 && (
          <CardFooter className="flex items-center justify-between py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Mostrando {unidadesPaginadas.length} de {unidadesFiltradas.length} unidades
              {units.length !== unidadesFiltradas.length && ` (filtradas de ${units.length} no total)`}
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
    </>
  );
};

export default UnitsTab; 