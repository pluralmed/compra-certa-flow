
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { TempItem } from "./types";
import { Item, ItemGroup } from "@/context/data/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ItemSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: TempItem[];
  onConfirm: (items: TempItem[]) => void;
  availableItems: Item[];
  itemGroups: ItemGroup[];
}

const ItemSelectionModal: React.FC<ItemSelectionModalProps> = ({
  open,
  onOpenChange,
  items,
  onConfirm,
  availableItems,
  itemGroups,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("all");
  const [tempItems, setTempItems] = useState<TempItem[]>([]);

  useEffect(() => {
    // Initialize tempItems with the items already selected when modal is opened
    if (open) {
      setTempItems([...items]);
      setSelectedGroupId("all"); // Reset group selection when opening the modal
    }
  }, [open, items]);

  // Filter items by search term and selected group
  const filteredItems = availableItems.filter((item) => {
    const matchesSearchTerm = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    // If the selected group is 'all', return all items that match the search term
    if (selectedGroupId === "all") return matchesSearchTerm;
    // If a group is selected, filter by group in addition to the search term
    return matchesSearchTerm && item.group.id === selectedGroupId;
  });

  const handleAddTempItem = (item: Item) => {
    const existingItem = tempItems.find((i) => i.id === item.id);

    if (existingItem) {
      // If item already exists, just update the quantity
      setTempItems((prevItems) =>
        prevItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      );
    } else {
      // If item doesn't exist, add it
      setTempItems([
        ...tempItems,
        {
          id: item.id,
          name: item.name,
          quantity: 1,
          unitOfMeasure: item.unitOfMeasure.abbreviation,
        },
      ]);
    }
  };

  const handleRemoveTempItem = (id: string) => {
    setTempItems(tempItems.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return;

    setTempItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleConfirm = () => {
    onConfirm(tempItems);
    onOpenChange(false);
  };

  // Function to format the item name with the unit of measure
  const formatItemName = (name: string, unitOfMeasure?: string) => {
    if (!unitOfMeasure) return name;

    return (
      <>
        {name} <span className="text-muted-foreground text-xs">({unitOfMeasure})</span>
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Adicionar Itens</DialogTitle>
          <DialogDescription>
            Busque e selecione os itens para sua solicitação
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search bar */}
          <div className="flex items-center relative">
            <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar item..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Group list */}
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
                <SelectItem value="all">Todos os grupos</SelectItem>
                {itemGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Available items list */}
          <div className="grid grid-cols-1 gap-2">
            <h4 className="text-sm font-medium">Itens Disponíveis</h4>
            <ScrollArea className="h-[200px] rounded-md border border-gray-300 shadow-sm bg-white p-2">
              {filteredItems.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">
                  Nenhum item encontrado
                </p>
              ) : (
                <div className="space-y-2">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md border border-gray-200"
                    >
                      <span>
                        {item.name}{" "}
                        <span className="text-muted-foreground text-xs">
                          ({item.unitOfMeasure.abbreviation})
                        </span>
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

          {/* Selected items */}
          <div className="grid grid-cols-1 gap-2">
            <h4 className="text-sm font-medium">Itens Selecionados</h4>
            {tempItems.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground border rounded-md">
                Nenhum item selecionado
              </p>
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
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setSelectedGroupId("all");
            }}
          >
            Cancelar
          </Button>
          <Button type="button" onClick={handleConfirm}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ItemSelectionModal;
