import React, { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Plus, X, Check, CheckCircle, XCircle } from "lucide-react";
import { TempItem } from "./types";
import { Item, ItemGroup, UnitOfMeasure } from "@/context/data/types";
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
  onConfirm: (items: TempItem[]) => void;
  items?: TempItem[];
  availableItems: Item[];
  itemGroups: ItemGroup[];
}

const ItemSelectionModal: React.FC<ItemSelectionModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  items: initialItems = [],
  availableItems,
  itemGroups,
}) => {
  const [tempItems, setTempItems] = useState<TempItem[]>(initialItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    if (open) {
      setTempItems([...initialItems]);
      setSelectedGroupId("all");
    }
  }, [open, initialItems]);

  // Filter items by search term and selected group
  const filteredItems = availableItems.filter((item) => {
    const matchesSearchTerm = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesGroup =
      selectedGroupId === "all" || item.group.id === selectedGroupId;
    return matchesSearchTerm && matchesGroup;
  });

  // Calcular itens paginados
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Funções de navegação
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAddTempItem = (item: Item) => {
    const existingItem = tempItems.find((i) => i.id === item.id);
    if (existingItem) {
      setTempItems(
        tempItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
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
      <DialogContent className="sm:max-w-[900px] max-h-[90vh]" hideCloseButton>
        <div className="flex justify-end gap-2 absolute right-4 top-4 z-20">
          <Button
            variant="ghost"
            className="min-w-[48px] min-h-[48px] p-0"
            onClick={handleConfirm}
            title="Confirmar"
          >
            <CheckCircle className="h-12 w-12 text-teal-700" />
          </Button>
          <Button
            variant="ghost"
            className="min-w-[48px] min-h-[48px] p-0"
            onClick={() => onOpenChange(false)}
            title="Fechar"
          >
            <XCircle className="h-12 w-12 text-red-500" />
          </Button>
        </div>
        <DialogHeader>
          <DialogTitle>Adicionar Itens</DialogTitle>
          <DialogDescription>
            Busque e selecione os itens para sua solicitação
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* Left column - Search and available items */}
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
              <ScrollArea className="h-[320px] rounded-md border border-gray-300 shadow-sm bg-white p-2">
                {filteredItems.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">
                    Nenhum item encontrado
                  </p>
                ) : (
                  <>
                    <div className="space-y-2">
                      {paginatedItems.map((item) => (
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
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between mt-4 pt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToPreviousPage}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Anterior
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          Página {currentPage} de {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToNextPage}
                          disabled={currentPage === totalPages}
                        >
                          Próxima
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </ScrollArea>
            </div>
          </div>

          {/* Right column - Selected items */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Itens Selecionados</h4>
            {tempItems.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground border rounded-md">
                Nenhum item selecionado
              </p>
            ) : (
              <ScrollArea className="h-[400px] rounded-md border border-gray-300 shadow-sm bg-white p-2">
                <div className="space-y-2">
                  {tempItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md border border-gray-200"
                    >
                      <span>{formatItemName(item.name, item.unitOfMeasure)}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border rounded-md">
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
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            setTempItems(tempItems.filter((i) => i.id !== item.id))
                          }
                        >
                          <span>×</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemSelectionModal;
