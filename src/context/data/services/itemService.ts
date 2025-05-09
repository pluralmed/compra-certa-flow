import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Item, ItemGroup, UnitOfMeasure } from '../types';

// Objeto de grupo padrão para quando não existir grupo
const DEFAULT_GROUP: ItemGroup = {
  id: '0',
  name: 'Sem grupo'
};

// Objeto de unidade de medida padrão para quando não existir unidade
const DEFAULT_UNIT_OF_MEASURE: UnitOfMeasure = {
  id: '0',
  name: 'Não definida',
  abbreviation: 'N/D'
};

export const useItemService = () => {
  const [items, setItems] = useState<Item[]>([]);
  const { toast } = useToast();

  // Fetch items
  const fetchItems = async () => {
    try {
      console.log("Iniciando fetchItems");
      // Primeiro, buscar todos os itens da tabela compras_itens
      console.log("Tentando conectar ao Supabase...");
      
      // Verificar se o Supabase está acessível
      const { data: testData, error: testError } = await supabase
        .from('compras_grupos_itens')
        .select('count(*)');
        
      console.log("Teste de conexão:", testData, testError);
      
      const { data: itemsData, error: itemsError } = await supabase
        .from('compras_itens')
        .select('*');
        
      console.log("Itens da tabela compras_itens:", itemsData);
      console.log("Erro ao buscar itens:", itemsError);
      
      if (itemsError) {
        console.error("Erro ao buscar itens:", itemsError);
        throw itemsError;
      }
      
      // Se não houver itens
      if (!itemsData || itemsData.length === 0) {
        console.log("Nenhum item encontrado na tabela compras_itens");
        setItems([]);
        return;
      }
      
      // Buscar grupos e unidades de medida
      const { data: groupsData, error: groupsError } = await supabase
        .from('compras_grupos_itens')
        .select('*');
        
      console.log("Grupos de itens:", groupsData);
      
      if (groupsError) {
        console.error("Erro ao buscar grupos:", groupsError);
        throw groupsError;
      }
      
      const { data: unitsData, error: unitsError } = await supabase
        .from('compras_unidades_medida')
        .select('*');
        
      console.log("Unidades de medida:", unitsData);
      
      if (unitsError) {
        console.error("Erro ao buscar unidades de medida:", unitsError);
        throw unitsError;
      }
      
      // Mapear os itens para o formato esperado
      const transformedItems: Item[] = itemsData.map(item => {
        // Verificar se grupo_id existe e é válido
        let mappedGroup: ItemGroup = DEFAULT_GROUP;
        if (item.grupo_id && groupsData && groupsData.length > 0) {
          const group = groupsData.find(g => g.id === item.grupo_id);
          if (group) {
            mappedGroup = {
              id: group.id.toString(),
              name: group.nome
            };
          }
        }
        
        // Verificar se unidade_medida_id existe e é válido
        let mappedUnit: UnitOfMeasure = DEFAULT_UNIT_OF_MEASURE;
        if (item.unidade_medida_id && unitsData && unitsData.length > 0) {
          const unit = unitsData.find(u => u.id === item.unidade_medida_id);
          if (unit) {
            mappedUnit = {
              id: unit.id.toString(),
              name: unit.nome,
              abbreviation: unit.sigla
            };
          }
        }
    
        // Converter o valor médio para número, ou usar 0 como padrão se for nulo
        const averagePrice = item.valor_medio !== null && item.valor_medio !== undefined ? 
          typeof item.valor_medio === 'string' ? 
            parseFloat(item.valor_medio) : 
            Number(item.valor_medio) : 
          0;
        
        return {
          id: item.id.toString(),
          name: item.nome,
          group: mappedGroup,
          unitOfMeasure: mappedUnit,
          averagePrice
        };
      });
      
      console.log("Itens transformados:", transformedItems);
      setItems(transformedItems);
    } catch (error) {
      console.error("Error fetching items:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os itens.",
        variant: "destructive",
      });
    }
  };

  // Add item
  const addItem = async (item: Omit<Item, 'id'>) => {
    try {
      // Primeiro, buscar os grupos e unidades disponíveis para garantir que temos valores válidos
      const { data: groupsData, error: groupsError } = await supabase
        .from('compras_grupos_itens')
        .select('*');
        
      if (groupsError) throw groupsError;
      
      const { data: unitsData, error: unitsError } = await supabase
        .from('compras_unidades_medida')
        .select('*');
        
      if (unitsError) throw unitsError;
      
      // Definir valores padrão para grupo_id e unidade_medida_id caso seja '0'
      let grupoId = item.group.id === '0' ? null : parseInt(item.group.id);
      let unidadeMedidaId = item.unitOfMeasure.id === '0' ? null : parseInt(item.unitOfMeasure.id);
      
      // Se forem nulos e houverem valores disponíveis, usar o primeiro da lista
      if (grupoId === null && groupsData && groupsData.length > 0) {
        grupoId = groupsData[0].id;
      }
      
      if (unidadeMedidaId === null && unitsData && unitsData.length > 0) {
        unidadeMedidaId = unitsData[0].id;
      }
      
      // Se ainda forem nulos, não podemos prosseguir
      if (grupoId === null || unidadeMedidaId === null) {
        throw new Error("Não foi possível criar o item. É necessário ter pelo menos um grupo e uma unidade de medida cadastrados.");
      }
      
      const { data, error } = await supabase
        .from('compras_itens')
        .insert({
          nome: item.name,
          grupo_id: grupoId,
          unidade_medida_id: unidadeMedidaId,
          valor_medio: item.averagePrice || 0
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Encontrar o grupo e unidade usados na inserção
        const group = groupsData?.find(g => g.id === grupoId);
        const unit = unitsData?.find(u => u.id === unidadeMedidaId);
        
        // Converter o valor médio para número
        const averagePrice = data.valor_medio !== null ? 
          typeof data.valor_medio === 'string' ? 
            parseFloat(data.valor_medio) : 
            Number(data.valor_medio) : 
          0;
          
        const newItem: Item = {
          id: data.id.toString(),
          name: data.nome,
          group: group ? {
            id: group.id.toString(),
            name: group.nome
          } : DEFAULT_GROUP,
          unitOfMeasure: unit ? {
            id: unit.id.toString(),
            name: unit.nome,
            abbreviation: unit.sigla
          } : DEFAULT_UNIT_OF_MEASURE,
          averagePrice
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
      // Primeiro, buscar os grupos e unidades disponíveis para garantir que temos valores válidos
      const { data: groupsData, error: groupsError } = await supabase
        .from('compras_grupos_itens')
        .select('*');
        
      if (groupsError) throw groupsError;
      
      const { data: unitsData, error: unitsError } = await supabase
        .from('compras_unidades_medida')
        .select('*');
        
      if (unitsError) throw unitsError;
      
      // Definir valores padrão para grupo_id e unidade_medida_id caso seja '0'
      let grupoId = item.group.id === '0' ? null : parseInt(item.group.id);
      let unidadeMedidaId = item.unitOfMeasure.id === '0' ? null : parseInt(item.unitOfMeasure.id);
      
      // Se forem nulos e houverem valores disponíveis, usar o primeiro da lista
      if (grupoId === null && groupsData && groupsData.length > 0) {
        grupoId = groupsData[0].id;
      }
      
      if (unidadeMedidaId === null && unitsData && unitsData.length > 0) {
        unidadeMedidaId = unitsData[0].id;
      }
      
      // Se ainda forem nulos, não podemos prosseguir
      if (grupoId === null || unidadeMedidaId === null) {
        throw new Error("Não foi possível atualizar o item. É necessário ter pelo menos um grupo e uma unidade de medida cadastrados.");
      }
      
      const { error } = await supabase
        .from('compras_itens')
        .update({
          nome: item.name,
          grupo_id: grupoId,
          unidade_medida_id: unidadeMedidaId,
          valor_medio: item.averagePrice || 0
        })
        .eq('id', parseInt(item.id));
      
      if (error) throw error;
      
      // Encontrar o grupo e unidade usados na atualização
      const group = groupsData?.find(g => g.id === grupoId);
      const unit = unitsData?.find(u => u.id === unidadeMedidaId);
      
      // Criar o item atualizado com os dados corretos
      const updatedItem: Item = {
        ...item,
        group: group ? {
          id: group.id.toString(),
          name: group.nome
        } : DEFAULT_GROUP,
        unitOfMeasure: unit ? {
          id: unit.id.toString(),
          name: unit.nome,
          abbreviation: unit.sigla
        } : DEFAULT_UNIT_OF_MEASURE
      };
      
      setItems(items.map(i => i.id === item.id ? updatedItem : i));
      
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
        .eq('id', parseInt(id));
      
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
    addItem,
    updateItem,
    deleteItem
  };
};
