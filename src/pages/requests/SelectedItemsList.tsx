
import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { TempItem } from "./types";

interface SelectedItemsListProps {
  items: TempItem[];
  onRemoveItem: (index: number) => void;
}

const SelectedItemsList: React.FC<SelectedItemsListProps> = ({ items, onRemoveItem }) => {
  // Function to format the item name with the unit of measure
  const formatItemName = (name: string, unitOfMeasure?: string): ReactNode => {
    if (!unitOfMeasure) return name;

    return (
      <>
        {name} <span className="text-muted-foreground text-xs">({unitOfMeasure})</span>
      </>
    );
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <Label>Itens Selecionados</Label>
      <div className="mt-2 border border-teal-300 rounded-md p-3 bg-teal-50">
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 bg-white border border-teal-200 rounded-md"
            >
              <span>
                {formatItemName(item.name, item.unitOfMeasure)} - Quantidade: {item.quantity}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemoveItem(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SelectedItemsList;
