
import { Budget, Client, Item, ItemGroup, Priority, RequestType, Unit } from "@/context/data/types";

export interface TempItem {
  id: string;
  name: string;
  quantity: number;
  unitOfMeasure?: string;
}

export interface RequestFormData {
  client: Client | null;
  unit: Unit | null;
  budget: Budget | null;
  type: RequestType;
  justification: string;
  priority: Priority;
  items: TempItem[];
}
