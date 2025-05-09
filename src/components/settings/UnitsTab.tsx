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