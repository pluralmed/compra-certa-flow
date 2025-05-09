
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '../types';

export const useClientService = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const { toast } = useToast();

  // Fetch clients
  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('compras_clientes')
      .select('*');
      
    if (error) throw error;
    
    if (data) {
      const transformedClients: Client[] = data.map(client => ({
        id: client.id.toString(),
        name: client.nome,
        municipality: client.municipio
      }));
      
      setClients(transformedClients);
    }
    return true;
  };

  // Get client by ID
  const getClientById = (id: string) => {
    return clients.find(client => client.id === id);
  };

  // Add client
  const addClient = async (client: Omit<Client, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('compras_clientes')
        .insert({
          nome: client.name,
          municipio: client.municipality
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const newClient: Client = {
          id: data.id.toString(),
          name: data.nome,
          municipality: data.municipio
        };
        
        setClients([...clients, newClient]);
        
        toast({
          title: "Cliente adicionado",
          description: `${client.name} foi adicionado com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error adding client:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o cliente.",
        variant: "destructive",
      });
    }
  };
  
  // Update client
  const updateClient = async (client: Client) => {
    try {
      const { error } = await supabase
        .from('compras_clientes')
        .update({
          nome: client.name,
          municipio: client.municipality
        })
        .eq('id', parseInt(client.id));
      
      if (error) throw error;
      
      setClients(clients.map(c => c.id === client.id ? client : c));
      
      toast({
        title: "Cliente atualizado",
        description: `${client.name} foi atualizado com sucesso.`,
      });
    } catch (error) {
      console.error('Error updating client:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o cliente.",
        variant: "destructive",
      });
    }
  };
  
  // Delete client
  const deleteClient = async (id: string) => {
    try {
      const clientToDelete = clients.find(c => c.id === id);
      
      const { error } = await supabase
        .from('compras_clientes')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) throw error;
      
      setClients(clients.filter(c => c.id !== id));
      
      if (clientToDelete) {
        toast({
          title: "Cliente removido",
          description: `${clientToDelete.name} foi removido com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o cliente.",
        variant: "destructive",
      });
    }
  };

  return {
    clients,
    setClients,
    fetchClients,
    getClientById,
    addClient,
    updateClient,
    deleteClient
  };
};
