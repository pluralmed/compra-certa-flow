
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ItemGroup } from '../types';

export const useItemGroupService = () => {
  const [itemGroups, setItemGroups] = useState<ItemGroup[]>([]);
  const { toast } = useToast();

  // Fetch item groups
  const fetchItemGroups = async () => {
    const { data, error } = await supabase
      .from('compras_grupos_itens')
      .select('*');
      
    if (error) throw error;
    
    if (data) {
      const transformedGroups: ItemGroup[] = data.map(group => ({
        id: group.id.toString(),
        name: group.nome
      }));
      
      setItemGroups(transformedGroups);
    }
  };

  // Add item group
  const addItemGroup = async (group: Omit<ItemGroup, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('compras_grupos_itens')
        .insert({
          nome: group.name
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const newGroup: ItemGroup = {
          id: data.id.toString(),
          name: data.nome
        };
        
        setItemGroups([...itemGroups, newGroup]);
        
        toast({
          title: "Grupo adicionado",
          description: `${group.name} foi adicionado com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error adding item group:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o grupo.",
        variant: "destructive",
      });
    }
  };
  
  // Update item group
  const updateItemGroup = async (group: ItemGroup) => {
    try {
      const { error } = await supabase
        .from('compras_grupos_itens')
        .update({
          nome: group.name
        })
        .eq('id', parseInt(group.id));
      
      if (error) throw error;
      
      setItemGroups(itemGroups.map(g => g.id === group.id ? group : g));
      
      toast({
        title: "Grupo atualizado",
        description: `${group.name} foi atualizado com sucesso.`,
      });
    } catch (error) {
      console.error('Error updating item group:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o grupo.",
        variant: "destructive",
      });
    }
  };
  
  // Delete item group
  const deleteItemGroup = async (id: string) => {
    try {
      const groupToDelete = itemGroups.find(g => g.id === id);
      
      const { error } = await supabase
        .from('compras_grupos_itens')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) throw error;
      
      setItemGroups(itemGroups.filter(g => g.id !== id));
      
      if (groupToDelete) {
        toast({
          title: "Grupo removido",
          description: `${groupToDelete.name} foi removido com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error deleting item group:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o grupo.",
        variant: "destructive",
      });
    }
  };

  return {
    itemGroups,
    setItemGroups,
    fetchItemGroups,
    addItemGroup,
    updateItemGroup,
    deleteItemGroup
  };
};
