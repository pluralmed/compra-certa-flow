
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
import { Plus, Edit, Trash2, AlertCircle, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { ItemGroup, UnitOfMeasure } from '@/context/data/types';
import { useData } from '@/context/data/DataContext';
import { Badge } from '@/components/ui/badge';

// Objeto de grupo padrão para quando não existir grupo
const DEFAULT_GROUP: ItemGroup = {
  id: '0',
  name: 'Sem grupo'
};

// Objeto de unidade de medida padrão para quando não existir unidade
const DEFAULT_UNIT_OF_MEASURE: UnitOfMeasure = {
  id: '0',
  name: 'Não definida',
  abbreviation: 'N/D'
};

// Configuração de paginação
const ITENS_POR_PAGINA = 5;

interface ItemsTabProps {
  items: any[];
  addItem: (item: any) => void;
  updateItem: (item: any) => void;
  deleteItem: (itemId: string) => void;
}

const ItemsTab: React.FC<ItemsTabProps> = ({
  items,
  addItem,
  updateItem,
  deleteItem,
}) => {
  // Usar o contexto de dados para acessar os grupos de itens e unidades de medida
  const { itemGroups, unitsOfMeasure } = useData();
  
  // Adicionar os valores padrão às listas, se ainda não existirem
  const allItemGroups = [DEFAULT_GROUP, ...itemGroups.filter(g => g.id !== '0')];
  const allUnitsOfMeasure = [DEFAULT_UNIT_OF_MEASURE, ...unitsOfMeasure.filter(u => u.id !== '0')];
  
  // Dialog states
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [isDeleteItemOpen, setIsDeleteItemOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // Estado de busca
  const [termoBusca, setTermoBusca] = useState('');
  const [itensFiltrados, setItensFiltrados] = useState(items);
  
  // Estados de paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const totalPaginas = Math.ceil(itensFiltrados.length / ITENS_POR_PAGINA);
  
  // Form states
  const [itemName, setItemName] = useState('');
  const [itemGroupId, setItemGroupId] = useState<string>('');
  const [itemUnitOfMeasureId, setItemUnitOfMeasureId] = useState<string>('');
  const [itemAveragePrice, setItemAveragePrice] = useState('');
  
  // Atualizar itens filtrados quando a busca mudar
  useEffect(() => {
    if (!termoBusca.trim()) {
      setItensFiltrados(items);
    } else {
      const termoLowerCase = termoBusca.toLowerCase();
      const resultado = items.filter(item => 
        item.name.toLowerCase().includes(termoLowerCase) || 
        item.group.name.toLowerCase().includes(termoLowerCase) ||
        item.unitOfMeasure.name.toLowerCase().includes(termoLowerCase) ||
        item.unitOfMeasure.abbreviation.toLowerCase().includes(termoLowerCase)
      );
      setItensFiltrados(resultado);
    }
    // Volta para a primeira página quando o filtro mudar
    setPaginaAtual(1);
  }, [termoBusca, items]);
  
  // Inicializar valores padrão quando os dados são carregados
  useEffect(() => {
    if (allItemGroups.length > 0 && !itemGroupId) {
      setItemGroupId(allItemGroups[0].id);
    }
    
    if (allUnitsOfMeasure.length > 0 && !itemUnitOfMeasureId) {
      setItemUnitOfMeasureId(allUnitsOfMeasure[0].id);
    }
  }, [allItemGroups, allUnitsOfMeasure, itemGroupId, itemUnitOfMeasureId]);
  
  // Resetar valores ao abrir/fechar modal de adicionar item
  useEffect(() => {
    if (isAddItemOpen) {
      setItemName('');
      setItemAveragePrice('');
      if (allItemGroups.length > 0) {
        setItemGroupId(allItemGroups[0].id);
      }
      if (allUnitsOfMeasure.length > 0) {
        setItemUnitOfMeasureId(allUnitsOfMeasure[0].id);
      }
    }
  }, [isAddItemOpen, allItemGroups, allUnitsOfMeasure]);
  
  // Itens da página atual
  const itensPaginados = itensFiltrados.slice(
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
  
  const resetItemForm = () => {
    setItemName('');
    setItemAveragePrice('');
    if (allItemGroups.length > 0) {
      setItemGroupId(allItemGroups[0].id);
    }
    if (allUnitsOfMeasure.length > 0) {
      setItemUnitOfMeasureId(allUnitsOfMeasure[0].id);
    }
  };
  
  // Item handlers
  const handleAddItem = () => {
    // Verificar se o nome do item foi preenchido
    if (!itemName.trim()) {
      console.error("Nome do item é obrigatório");
      return;
    }
  
    // Encontrar o grupo selecionado pelo id
    const selectedGroup = allItemGroups.find(group => group.id === itemGroupId);
    if (!selectedGroup) {
      console.error("Grupo não encontrado:", itemGroupId);
      return;
    }
    
    // Encontrar a unidade de medida selecionada pelo id
    const selectedUnitOfMeasure = allUnitsOfMeasure.find(unit => unit.id === itemUnitOfMeasureId);
    if (!selectedUnitOfMeasure) {
      console.error("Unidade de medida não encontrada:", itemUnitOfMeasureId);
      return;
    }
    
    const group: ItemGroup = {
      id: selectedGroup.id,
      name: selectedGroup.name
    };
    
    const unitOfMeasure: UnitOfMeasure = {
      id: selectedUnitOfMeasure.id,
      name: selectedUnitOfMeasure.name,
      abbreviation: selectedUnitOfMeasure.abbreviation
    };
    
    // Adicionar o item e fechar o modal
    console.log("Adicionando item:", {
      name: itemName,
      group,
      unitOfMeasure,
      averagePrice: parseFloat(itemAveragePrice) || 0,
    });
    
    addItem({
      name: itemName,
      group,
      unitOfMeasure,
      averagePrice: parseFloat(itemAveragePrice) || 0,
    });
    
    resetItemForm();
    setIsAddItemOpen(false);
  };
  
  const handleUpdateItem = () => {
    if (!selectedItem) return;
    
    // Encontrar o grupo selecionado pelo id
    const selectedGroup = allItemGroups.find(group => group.id === itemGroupId);
    if (!selectedGroup) return;
    
    // Encontrar a unidade de medida selecionada pelo id
    const selectedUnitOfMeasure = allUnitsOfMeasure.find(unit => unit.id === itemUnitOfMeasureId);
    if (!selectedUnitOfMeasure) return;
    
    const group: ItemGroup = {
      id: selectedGroup.id,
      name: selectedGroup.name
    };
    
    const unitOfMeasure: UnitOfMeasure = {
      id: selectedUnitOfMeasure.id,
      name: selectedUnitOfMeasure.name,
      abbreviation: selectedUnitOfMeasure.abbreviation
    };
    
    updateItem({
      ...selectedItem,
      name: itemName,
      group,
      unitOfMeasure,
      averagePrice: parseFloat(itemAveragePrice) || 0,
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
    setItemGroupId(item.group.id);
    setItemName(item.name);
    setItemUnitOfMeasureId(item.unitOfMeasure.id);
    setItemAveragePrice(item.averagePrice.toString());
    setIsEditItemOpen(true);
  };
  
  const openDeleteItemDialog = (item: any) => {
    setSelectedItem(item);
    setIsDeleteItemOpen(true);
  };
  
  // Debug: verificar se os itens estão sendo recebidos
  React.useEffect(() => {
    console.log("ItemsTab - items recebidos:", items);
    console.log("ItemsTab - grupos de itens:", allItemGroups);
    console.log("ItemsTab - unidades de medida:", allUnitsOfMeasure);
  }, [items, allItemGroups, allUnitsOfMeasure]);
  
  // Função para renderizar a célula do grupo com destaque visual se for o grupo padrão
  const renderGroupCell = (group: ItemGroup) => {
    if (group.id === '0') {
      return (
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
            {group.name}
          </Badge>
          <AlertCircle className="h-4 w-4 text-yellow-500" />
        </div>
      );
    }
    return group.name;
  };
  
  // Função para renderizar a célula da unidade de medida com destaque visual se for a unidade padrão
  const renderUnitOfMeasureCell = (unitOfMeasure: UnitOfMeasure) => {
    if (unitOfMeasure.id === '0') {
      return (
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
            {unitOfMeasure.abbreviation}
          </Badge>
          <AlertCircle className="h-4 w-4 text-yellow-500" />
        </div>
      );
    }
    return unitOfMeasure.abbreviation;
  };
  
  // Função para renderizar a célula do preço médio com destaque visual se for zero
  const renderAveragePriceCell = (averagePrice: number) => {
    if (averagePrice === 0) {
      return (
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">{formatCurrency(averagePrice)}</span>
          <AlertCircle className="h-4 w-4 text-yellow-500" />
        </div>
      );
    }
    return formatCurrency(averagePrice);
  };
  
  return (
    <>
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
                    value={itemGroupId}
                    onValueChange={(value: string) => setItemGroupId(value)}
                    disabled={allItemGroups.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={allItemGroups.length === 0 ? 'Nenhum grupo disponível' : 'Selecione o grupo'} />
                    </SelectTrigger>
                    <SelectContent>
                      {allItemGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
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
                    value={itemUnitOfMeasureId}
                    onValueChange={(value: string) => setItemUnitOfMeasureId(value)}
                    disabled={allUnitsOfMeasure.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={allUnitsOfMeasure.length === 0 ? 'Nenhuma unidade disponível' : 'Selecione a unidade'} />
                    </SelectTrigger>
                    <SelectContent>
                      {allUnitsOfMeasure.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name} ({unit.abbreviation})
                        </SelectItem>
                      ))}
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
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar itens por nome, grupo ou unidade..."
              className="w-full pl-8 bg-white"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </div>

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
                {itensPaginados.map(item => (
                  <TableRow key={item.id} className={item.group.id === '0' || item.unitOfMeasure.id === '0' ? "bg-yellow-50" : ""}>
                    <TableCell>{renderGroupCell(item.group)}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{renderUnitOfMeasureCell(item.unitOfMeasure)}</TableCell>
                    <TableCell>{renderAveragePriceCell(item.averagePrice)}</TableCell>
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
                {itensFiltrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      {termoBusca ? `Nenhum item encontrado para "${termoBusca}"` : "Nenhum item encontrado."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {itensFiltrados.length > 0 && (
          <CardFooter className="flex items-center justify-between py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Mostrando {itensPaginados.length} de {itensFiltrados.length} itens
              {items.length !== itensFiltrados.length && ` (filtrados de ${items.length} no total)`}
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
                value={itemGroupId} 
                onValueChange={(value: string) => setItemGroupId(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o grupo" />
                </SelectTrigger>
                <SelectContent>
                  {allItemGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
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
                value={itemUnitOfMeasureId} 
                onValueChange={(value: string) => setItemUnitOfMeasureId(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  {allUnitsOfMeasure.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name} ({unit.abbreviation})
                    </SelectItem>
                  ))}
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
    </>
  );
};

export default ItemsTab; 
