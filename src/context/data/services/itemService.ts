
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Item } from '../types';

export const useItemService = () => {
  const [items, setItems] = useState<Item[]>([]);
  const { toast } = useToast();

  // Fetch items
  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('compras_itens')
      .select(`
        *,
        compras_unidades_medida (*),
        compras_grupos_itens (*)
      `);
      
    if (error) throw error;
    
    if (data) {
      const transformedItems: Item[] = data.map(item => ({
        id: item.id.toString(), // Convert to string
        name: item.nome,
        description: item.descricao || "",
        unitOfMeasure: {
          id: item.compras_unidades_medida.id.toString(),
          name: item.compras_unidades_medida.nome,
          abbreviation: item.compras_unidades_medida.sigla
        },
        group: {
          id: item.compras_grupos_itens.id.toString(),
          name: item.compras_grupos_itens.nome
        }
      }));
      
      setItems(transformedItems);
    }
  };

  // Get item by ID
  const getItemById = (id: string) => {
    return items.find(item => item.id === id);
  };

  // Add item
  const addItem = async (item: Omit<Item, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('compras_itens')
        .insert({
          nome: item.name,
          descricao: item.description,
          unidade_medida_id: parseInt(item.unitOfMeasure.id), // Parse to integer for Supabase
          grupo_id: parseInt(item.group.id) // Parse to integer for Supabase
        })
        .select(`
          *,
          compras_unidades_medida (*),
          compras_grupos_itens (*)
        `)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const newItem: Item = {
          id: data.id.toString(),
          name: data.nome,
          description: data.descricao || "",
          unitOfMeasure: {
            id: data.compras_unidades_medida.id.toString(),
            name: data.compras_unidades_medida.nome,
            abbreviation: data.compras_unidades_medida.sigla
          },
          group: {
            id: data.compras_grupos_itens.id.toString(),
            name: data.compras_grupos_itens.nome
          }
        };
        
        setItems([...items, newItem]);
        
        toast({
          title: "Item adicionado",
          description: `${item.name} foi adicionado com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o item.",
        variant: "destructive",
      });
    }
  };
  
  // Update item
  const updateItem = async (item: Item) => {
    try {
      const { error } = await supabase
        .from('compras_itens')
        .update({
          nome: item.name,
          descricao: item.description,
          unidade_medida_id: parseInt(item.unitOfMeasure.id), // Parse to integer for Supabase
          grupo_id: parseInt(item.group.id) // Parse to integer for Supabase
        })
        .eq('id', parseInt(item.id)); // Parse to integer for Supabase
      
      if (error) throw error;
      
      setItems(items.map(i => i.id === item.id ? item : i));
      
      toast({
        title: "Item atualizado",
        description: `${item.name} foi atualizado com sucesso.`,
      });
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o item.",
        variant: "destructive",
      });
    }
  };
  
  // Delete item
  const deleteItem = async (id: string) => {
    try {
      const itemToDelete = items.find(i => i.id === id);
      
      const { error } = await supabase
        .from('compras_itens')
        .delete()
        .eq('id', parseInt(id)); // Parse to integer for Supabase
      
      if (error) throw error;
      
      setItems(items.filter(i => i.id !== id));
      
      if (itemToDelete) {
        toast({
          title: "Item removido",
          description: `${itemToDelete.name} foi removido com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o item.",
        variant: "destructive",
      });
    }
  };

  return {
    items,
    setItems,
    fetchItems,
    getItemById,
    addItem,
    updateItem,
    deleteItem
  };
};
