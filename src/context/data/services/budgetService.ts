
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Budget } from '../types';

export const useBudgetService = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const { toast } = useToast();

  // Fetch budgets
  const fetchBudgets = async () => {
    const { data, error } = await supabase
      .from('compras_rubricas')
      .select('*');
      
    if (error) throw error;
    
    if (data) {
      const transformedBudgets: Budget[] = data.map(budget => ({
        id: budget.id.toString(), // Convert to string
        name: budget.nome,
        clientId: budget.cliente_id.toString(), // Convert to string
        monthlyAmount: parseFloat(budget.valor_mensal)
      }));
      
      setBudgets(transformedBudgets);
    }
  };

  // Get budget by ID
  const getBudgetById = (id: string) => {
    return budgets.find(budget => budget.id === id);
  };

  // Add budget
  const addBudget = async (budget: Omit<Budget, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('compras_rubricas')
        .insert({
          nome: budget.name,
          cliente_id: parseInt(budget.clientId), // Fixed: Parse to integer for Supabase
          valor_mensal: budget.monthlyAmount
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const newBudget: Budget = {
          id: data.id.toString(),
          name: data.nome,
          clientId: data.cliente_id.toString(),
          monthlyAmount: parseFloat(data.valor_mensal)
        };
        
        setBudgets([...budgets, newBudget]);
        
        toast({
          title: "Rubrica adicionada",
          description: `${budget.name} foi adicionada com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error adding budget:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a rubrica.",
        variant: "destructive",
      });
    }
  };
  
  // Update budget
  const updateBudget = async (budget: Budget) => {
    try {
      const { error } = await supabase
        .from('compras_rubricas')
        .update({
          nome: budget.name,
          cliente_id: parseInt(budget.clientId), // Fixed: Parse to integer for Supabase
          valor_mensal: budget.monthlyAmount
        })
        .eq('id', parseInt(budget.id));
      
      if (error) throw error;
      
      setBudgets(budgets.map(b => b.id === budget.id ? budget : b));
      
      toast({
        title: "Rubrica atualizada",
        description: `${budget.name} foi atualizada com sucesso.`,
      });
    } catch (error) {
      console.error('Error updating budget:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a rubrica.",
        variant: "destructive",
      });
    }
  };
  
  // Delete budget
  const deleteBudget = async (id: string) => {
    try {
      const budgetToDelete = budgets.find(b => b.id === id);
      
      const { error } = await supabase
        .from('compras_rubricas')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) throw error;
      
      setBudgets(budgets.filter(b => b.id !== id));
      
      if (budgetToDelete) {
        toast({
          title: "Rubrica removida",
          description: `${budgetToDelete.name} foi removida com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a rubrica.",
        variant: "destructive",
      });
    }
  };

  return {
    budgets,
    setBudgets,
    fetchBudgets,
    getBudgetById,
    addBudget,
    updateBudget,
    deleteBudget
  };
};
