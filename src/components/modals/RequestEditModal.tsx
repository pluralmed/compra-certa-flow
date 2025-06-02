
import React, { useState, useEffect } from 'react';
import { useData } from '@/context/data/DataContext';
import { Request, RequestType, Priority } from '@/context/data/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RequestEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: Request;
  onConfirm: (updatedRequest: Request) => void;
}

const RequestEditModal: React.FC<RequestEditModalProps> = ({
  isOpen,
  onClose,
  request,
  onConfirm
}) => {
  const { clients, units, budgets } = useData();
  
  const [selectedClientId, setSelectedClientId] = useState(request.clientId);
  const [selectedUnitId, setSelectedUnitId] = useState(request.unitId);
  const [selectedBudgetId, setSelectedBudgetId] = useState(request.budgetId);
  const [selectedType, setSelectedType] = useState<RequestType>(request.type);
  const [selectedPriority, setSelectedPriority] = useState<Priority>(request.priority);
  const [justification, setJustification] = useState(request.justification);

  // Reset form when request changes
  useEffect(() => {
    setSelectedClientId(request.clientId);
    setSelectedUnitId(request.unitId);
    setSelectedBudgetId(request.budgetId);
    setSelectedType(request.type);
    setSelectedPriority(request.priority);
    setJustification(request.justification);
  }, [request]);

  const filteredUnits = units.filter(unit => unit.clientId === selectedClientId);
  const filteredBudgets = budgets.filter(budget => budget.clientId === selectedClientId);

  // When client changes, reset unit and budget if they're not valid anymore
  useEffect(() => {
    if (!filteredUnits.find(unit => unit.id === selectedUnitId)) {
      setSelectedUnitId('');
    }
    if (!filteredBudgets.find(budget => budget.id === selectedBudgetId)) {
      setSelectedBudgetId('');
    }
  }, [selectedClientId, filteredUnits, filteredBudgets, selectedUnitId, selectedBudgetId]);

  const handleConfirm = () => {
    if (!selectedClientId || !selectedUnitId || !selectedBudgetId || !justification.trim()) {
      return;
    }

    const updatedRequest: Request = {
      ...request,
      clientId: selectedClientId,
      unitId: selectedUnitId,
      budgetId: selectedBudgetId,
      type: selectedType,
      priority: selectedPriority,
      justification: justification.trim()
    };

    onConfirm(updatedRequest);
    onClose();
  };

  const isFormValid = selectedClientId && selectedUnitId && selectedBudgetId && justification.trim();

  // Sort clients and budgets alphabetically
  const sortedClients = [...clients].sort((a, b) => a.name.localeCompare(b.name));
  const sortedBudgets = [...filteredBudgets].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Informações da Solicitação</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client">Cliente</Label>
              <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {sortedClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="unit">Unidade</Label>
              <Select 
                value={selectedUnitId} 
                onValueChange={setSelectedUnitId}
                disabled={!selectedClientId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  {filteredUnits.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="budget">Rubrica</Label>
              <Select 
                value={selectedBudgetId} 
                onValueChange={setSelectedBudgetId}
                disabled={!selectedClientId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a rubrica" />
                </SelectTrigger>
                <SelectContent>
                  {sortedBudgets.map((budget) => (
                    <SelectItem key={budget.id} value={budget.id}>
                      {budget.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Tipo de Solicitação</Label>
              <Select value={selectedType} onValueChange={(value: RequestType) => setSelectedType(value)}>
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
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={selectedPriority} onValueChange={(value: Priority) => setSelectedPriority(value)}>
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!isFormValid}>
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestEditModal;
