import React from "react";
import { RequestFormData } from "./types";
import { Client, Unit, Budget, Priority, RequestType } from "@/context/data/types";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RequestFormProps {
  formData: RequestFormData;
  clients: Client[];
  units: Unit[];
  budgets: Budget[];
  onClientChange: (client: Client | null) => void;
  onUnitChange: (unit: Unit | null) => void;
  onBudgetChange: (budget: Budget | null) => void;
  onTypeChange: (type: RequestType) => void;
  onJustificationChange: (justification: string) => void;
  onPriorityChange: (priority: Priority) => void;
}

const RequestForm: React.FC<RequestFormProps> = ({
  formData,
  clients,
  units,
  budgets,
  onClientChange,
  onUnitChange,
  onBudgetChange,
  onTypeChange,
  onJustificationChange,
  onPriorityChange,
}) => {
  const { client, unit, budget, type, justification, priority } = formData;

  const filteredUnits = units.filter((u) => u.clientId === client?.id);
  const filteredBudgets = budgets.filter((b) => b.clientId === client?.id);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="client">Cliente</Label>
          <Select
            onValueChange={(value) =>
              onClientChange(clients.find((c) => c.id === value) || null)
            }
            value={client?.id}
          >
            <SelectTrigger>
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

        <div>
          <Label htmlFor="unit">Unidade</Label>
          <Select
            onValueChange={(value) =>
              onUnitChange(units.find((u) => u.id === value) || null)
            }
            value={unit?.id}
            disabled={!client}
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
            onValueChange={(value) =>
              onBudgetChange(budgets.find((b) => b.id === value) || null)
            }
            value={budget?.id}
            disabled={!client}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a rubrica" />
            </SelectTrigger>
            <SelectContent>
              {filteredBudgets.map((budget) => (
                <SelectItem key={budget.id} value={budget.id}>
                  {budget.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="type">Tipo de Solicitação</Label>
          <Select
            onValueChange={(value: RequestType) => onTypeChange(value)}
            value={type}
            defaultValue="Compra direta"
          >
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
          <Select onValueChange={(value: Priority) => onPriorityChange(value)} value={priority}>
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
          onChange={(e) => onJustificationChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default RequestForm;
