import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Plus, Edit, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { ItemGroup, UnitOfMeasure } from '@/context/data/types';

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
  // Dialog states
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [isDeleteItemOpen, setIsDeleteItemOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // Form states
  const [itemName, setItemName] = useState('');
  const [itemGroupName, setItemGroupName] = useState<string>('Materiais');
  const [itemUnitOfMeasureName, setItemUnitOfMeasureName] = useState<string>('UN');
  const [itemAveragePrice, setItemAveragePrice] = useState('');
  
  const resetItemForm = () => {
    setItemGroupName('Materiais');
    setItemName('');
    setItemUnitOfMeasureName('UN');
    setItemAveragePrice('');
  };
  
  // Item handlers
  const handleAddItem = () => {
    // Create proper ItemGroup and UnitOfMeasure objects
    const group: ItemGroup = {
      id: "1", // This would normally come from your itemGroups data
      name: itemGroupName
    };
    
    const unitOfMeasure: UnitOfMeasure = {
      id: "1", // This would normally come from your unitsOfMeasure data
      name: itemUnitOfMeasureName,
      abbreviation: itemUnitOfMeasureName
    };
    
    addItem({
      name: itemName,
      group,
      unitOfMeasure,
      averagePrice: parseFloat(itemAveragePrice),
    });
    resetItemForm();
    setIsAddItemOpen(false);
  };
  
  const handleUpdateItem = () => {
    if (!selectedItem) return;
    
    // Create proper ItemGroup and UnitOfMeasure objects
    const group: ItemGroup = {
      id: selectedItem.group.id,
      name: itemGroupName
    };
    
    const unitOfMeasure: UnitOfMeasure = {
      id: selectedItem.unitOfMeasure.id,
      name: itemUnitOfMeasureName,
      abbreviation: itemUnitOfMeasureName
    };
    
    updateItem({
      ...selectedItem,
      name: itemName,
      group,
      unitOfMeasure,
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
    setItemGroupName(item.group.name);
    setItemName(item.name);
    setItemUnitOfMeasureName(item.unitOfMeasure.abbreviation);
    setItemAveragePrice(item.averagePrice.toString());
    setIsEditItemOpen(true);
  };
  
  const openDeleteItemDialog = (item: any) => {
    setSelectedItem(item);
    setIsDeleteItemOpen(true);
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
                    value={itemGroupName} 
                    onValueChange={(value: string) => setItemGroupName(value)}
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
                    value={itemUnitOfMeasureName} 
                    onValueChange={(value: string) => setItemUnitOfMeasureName(value)}
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
                    <TableCell>{item.group.name}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.unitOfMeasure.abbreviation}</TableCell>
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
                value={itemGroupName} 
                onValueChange={(value: string) => setItemGroupName(value)}
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
                value={itemUnitOfMeasureName} 
                onValueChange={(value: string) => setItemUnitOfMeasureName(value)}
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
    </>
  );
};

export default ItemsTab; 