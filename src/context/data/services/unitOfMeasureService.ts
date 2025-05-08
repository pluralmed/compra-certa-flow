
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UnitOfMeasure } from '../types';

export const useUnitOfMeasureService = () => {
  const [unitsOfMeasure, setUnitsOfMeasure] = useState<UnitOfMeasure[]>([]);
  const { toast } = useToast();

  // Fetch units of measure
  const fetchUnitsOfMeasure = async () => {
    const { data, error } = await supabase
      .from('compras_unidades_medida')
      .select('*');
      
    if (error) throw error;
    
    if (data) {
      const transformedUnits: UnitOfMeasure[] = data.map(unit => ({
        id: unit.id.toString(),
        name: unit.nome,
        abbreviation: unit.sigla
      }));
      
      setUnitsOfMeasure(transformedUnits);
    }
  };

  // Add unit of measure
  const addUnitOfMeasure = async (unitOfMeasure: Omit<UnitOfMeasure, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('compras_unidades_medida')
        .insert({
          nome: unitOfMeasure.name,
          sigla: unitOfMeasure.abbreviation
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const newUnitOfMeasure: UnitOfMeasure = {
          id: data.id.toString(),
          name: data.nome,
          abbreviation: data.sigla
        };
        
        setUnitsOfMeasure([...unitsOfMeasure, newUnitOfMeasure]);
        
        toast({
          title: "Unidade de medida adicionada",
          description: `${unitOfMeasure.name} foi adicionada com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error adding unit of measure:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a unidade de medida.",
        variant: "destructive",
      });
    }
  };
  
  // Update unit of measure
  const updateUnitOfMeasure = async (unitOfMeasure: UnitOfMeasure) => {
    try {
      const { error } = await supabase
        .from('compras_unidades_medida')
        .update({
          nome: unitOfMeasure.name,
          sigla: unitOfMeasure.abbreviation
        })
        .eq('id', parseInt(unitOfMeasure.id));
      
      if (error) throw error;
      
      setUnitsOfMeasure(unitsOfMeasure.map(u => u.id === unitOfMeasure.id ? unitOfMeasure : u));
      
      toast({
        title: "Unidade de medida atualizada",
        description: `${unitOfMeasure.name} foi atualizada com sucesso.`,
      });
    } catch (error) {
      console.error('Error updating unit of measure:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a unidade de medida.",
        variant: "destructive",
      });
    }
  };
  
  // Delete unit of measure
  const deleteUnitOfMeasure = async (id: string) => {
    try {
      const unitToDelete = unitsOfMeasure.find(u => u.id === id);
      
      const { error } = await supabase
        .from('compras_unidades_medida')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) throw error;
      
      setUnitsOfMeasure(unitsOfMeasure.filter(u => u.id !== id));
      
      if (unitToDelete) {
        toast({
          title: "Unidade de medida removida",
          description: `${unitToDelete.name} foi removida com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error deleting unit of measure:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a unidade de medida.",
        variant: "destructive",
      });
    }
  };

  return {
    unitsOfMeasure,
    setUnitsOfMeasure,
    fetchUnitsOfMeasure,
    addUnitOfMeasure,
    updateUnitOfMeasure,
    deleteUnitOfMeasure
  };
};
