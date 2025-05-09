
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Unit } from '../types';

export const useUnitService = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const { toast } = useToast();

  // Fetch units
  const fetchUnits = async () => {
    const { data, error } = await supabase
      .from('compras_unidades')
      .select('*');
      
    if (error) throw error;
    
    if (data) {
      const transformedUnits: Unit[] = data.map(unit => ({
        id: unit.id.toString(),
        name: unit.nome,
        clientId: unit.cliente_id.toString()
      }));
      
      setUnits(transformedUnits);
    }
  };

  // Get unit by ID
  const getUnitById = (id: string) => {
    return units.find(unit => unit.id === id);
  };

  // Add unit
  const addUnit = async (unit: Omit<Unit, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('compras_unidades')
        .insert({
          nome: unit.name,
          cliente_id: parseInt(unit.clientId)
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const newUnit: Unit = {
          id: data.id.toString(),
          name: data.nome,
          clientId: data.cliente_id.toString()
        };
        
        setUnits([...units, newUnit]);
        
        toast({
          title: "Unidade adicionada",
          description: `${unit.name} foi adicionada com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error adding unit:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a unidade.",
        variant: "destructive",
      });
    }
  };
  
  // Update unit
  const updateUnit = async (unit: Unit) => {
    try {
      const { error } = await supabase
        .from('compras_unidades')
        .update({
          nome: unit.name,
          cliente_id: parseInt(unit.clientId)
        })
        .eq('id', parseInt(unit.id));
      
      if (error) throw error;
      
      setUnits(units.map(u => u.id === unit.id ? unit : u));
      
      toast({
        title: "Unidade atualizada",
        description: `${unit.name} foi atualizada com sucesso.`,
      });
    } catch (error) {
      console.error('Error updating unit:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a unidade.",
        variant: "destructive",
      });
    }
  };
  
  // Delete unit
  const deleteUnit = async (id: string) => {
    try {
      const unitToDelete = units.find(u => u.id === id);
      
      const { error } = await supabase
        .from('compras_unidades')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) throw error;
      
      setUnits(units.filter(u => u.id !== id));
      
      if (unitToDelete) {
        toast({
          title: "Unidade removida",
          description: `${unitToDelete.name} foi removida com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error deleting unit:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a unidade.",
        variant: "destructive",
      });
    }
  };

  return {
    units,
    setUnits,
    fetchUnits,
    getUnitById,
    addUnit,
    updateUnit,
    deleteUnit
  };
};
