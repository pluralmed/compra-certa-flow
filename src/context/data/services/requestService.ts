import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Request, RequestItem, Status, RequestType, Priority, StatusHistoryItem } from '../types';
import { mapRequestTypeToDatabase } from '@/utils/format';

export const useRequestService = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const { toast } = useToast();

  // Fetch requests
  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('compras_solicitacoes')
      .select(`
        *,
        compras_itens_solicitacao (*),
        compras_historico_status (
          id,
          status,
          data_criacao,
          usuario_id
        )
      `);
      
    if (error) throw error;
    
    if (data) {
      const transformedRequests: Request[] = await Promise.all(data.map(async (request) => {
        // Get items for this request
        const requestItems: RequestItem[] = request.compras_itens_solicitacao.map((item: any) => ({
          id: item.id.toString(),
          itemId: item.item_id.toString(),
          quantity: parseFloat(item.quantidade)
        }));
        
        // Transform status history
        const statusHistory: StatusHistoryItem[] = request.compras_historico_status.map((history: any) => ({
          id: history.id.toString(),
          status: history.status as Status,
          createdAt: history.data_criacao,
          userId: history.usuario_id.toString()
        }));
        
        return {
          id: request.id.toString(),
          clientId: request.cliente_id.toString(),
          unitId: request.unidade_id.toString(),
          type: request.tipo_solicitacao as RequestType,
          justification: request.justificativa,
          budgetId: request.rubrica_id.toString(),
          priority: request.prioridade as Priority,
          userId: request.usuario_id.toString(),
          createdAt: request.data_criacao,
          status: request.status as Status,
          items: requestItems,
          statusHistory
        };
      }));
      
      setRequests(transformedRequests);
    }
  };

  // Create request
  const createRequest = async (request: Omit<Request, 'id' | 'createdAt' | 'status'>): Promise<string> => {
    try {
      // Validação dos dados
      if (!request.clientId || !request.unitId || !request.budgetId || !request.userId) {
        throw new Error("Todos os IDs são obrigatórios");
      }

      // Validação dos tipos
      if (!['Compra direta', 'Cotação', 'Serviço'].includes(request.type)) {
        throw new Error("Tipo de solicitação inválido");
      }

      if (!['Moderado', 'Urgente', 'Emergencial'].includes(request.priority)) {
        throw new Error("Prioridade inválida");
      }

      if (!request.justification.trim()) {
        throw new Error("Justificativa é obrigatória");
      }

      if (!request.items.length) {
        throw new Error("É necessário incluir pelo menos um item");
      }

      // Conversão segura dos IDs para números
      const clientId = parseInt(request.clientId);
      const unitId = parseInt(request.unitId);
      const budgetId = parseInt(request.budgetId);
      const userId = parseInt(request.userId);

      if (isNaN(clientId) || isNaN(unitId) || isNaN(budgetId) || isNaN(userId)) {
        throw new Error("IDs inválidos");
      }

      // Criar a solicitação
      const { data: requestData, error: requestError } = await supabase
        .from('compras_solicitacoes')
        .insert({
          cliente_id: clientId,
          unidade_id: unitId,
          tipo_solicitacao: mapRequestTypeToDatabase(request.type),
          justificativa: request.justification.trim(),
          rubrica_id: budgetId,
          prioridade: request.priority,
          usuario_id: userId,
          status: 'Aguardando liberação',
          data_criacao: new Date().toISOString()
        })
        .select()
        .single();
      
      if (requestError) {
        console.error("Error creating request:", requestError);
        throw new Error(requestError.message);
      }
      
      if (!requestData) {
        throw new Error("Nenhum dado retornado na criação da solicitação");
      }
      
      // Validar e converter os itens
      const requestItems = request.items.map(item => {
        const itemId = parseInt(item.itemId);
        if (isNaN(itemId)) {
          throw new Error(`ID do item inválido: ${item.itemId}`);
        }
        if (item.quantity <= 0) {
          throw new Error(`Quantidade inválida para o item ${item.itemId}`);
        }
        return {
          solicitacao_id: requestData.id,
          item_id: itemId,
          quantidade: item.quantity
        };
      });
      
      // Criar os itens da solicitação
      const { data: itemsData, error: itemsError } = await supabase
        .from('compras_itens_solicitacao')
        .insert(requestItems)
        .select();
      
      if (itemsError) {
        // Se houver erro na criação dos itens, excluir a solicitação
        console.error("Error creating request items:", itemsError);
        await supabase
          .from('compras_solicitacoes')
          .delete()
          .eq('id', requestData.id);
        throw new Error(itemsError.message);
      }
      
      if (!itemsData) {
        throw new Error("Nenhum dado retornado na criação dos itens");
      }
      
      // Criar o objeto transformado para atualização do estado
      const newRequest: Request = {
        id: requestData.id.toString(),
        clientId: requestData.cliente_id.toString(),
        unitId: requestData.unidade_id.toString(),
        type: requestData.tipo_solicitacao as RequestType,
        justification: requestData.justificativa,
        budgetId: requestData.rubrica_id.toString(),
        priority: requestData.prioridade as Priority,
        userId: requestData.usuario_id.toString(),
        createdAt: requestData.data_criacao,
        status: requestData.status as Status,
        items: itemsData.map(item => ({
          id: item.id.toString(),
          itemId: item.item_id.toString(),
          quantity: item.quantidade
        })),
        statusHistory: []
      };
      
      setRequests(prevRequests => [...prevRequests, newRequest]);
      
      return requestData.id.toString();
    } catch (error) {
      console.error("Error creating request:", error);
      toast({
        title: "Erro ao criar solicitação",
        description: error instanceof Error ? error.message : "Não foi possível criar a solicitação. Por favor, tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  // Update request
  const updateRequest = async (request: Request) => {
    try {
      const { error } = await supabase
        .from('compras_solicitacoes')
        .update({
          cliente_id: parseInt(request.clientId),
          unidade_id: parseInt(request.unitId),
          tipo_solicitacao: mapRequestTypeToDatabase(request.type),
          justificativa: request.justification,
          rubrica_id: parseInt(request.budgetId),
          prioridade: request.priority,
          status: request.status
        })
        .eq('id', parseInt(request.id));
      
      if (error) throw error;
      
      // Update request items - this is more complex and would require
      // deleting existing items and creating new ones,
      // for brevity we'll just update the state
      
      setRequests(requests.map(r => r.id === request.id ? request : r));
      
      toast({
        title: "Solicitação atualizada",
        description: "A solicitação foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a solicitação.",
        variant: "destructive",
      });
    }
  };
  
  // Update request status
  const updateRequestStatus = async (id: string, status: Status, userId: string, rejectionJustification?: string) => {
    try {
      console.log(`Atualizando solicitação ${id} para status ${status} pelo usuário ${userId}`);
      
      // Prepare update data
      const updateData: any = { 
        status,
        usuario_id: parseInt(userId) // Importante: isso fará o trigger usar o ID do usuário correto
      };
      
      // If this is a rejection and justification is provided, include it
      if (status === 'Solicitação rejeitada' && rejectionJustification) {
        updateData.justificativa_rejeicao = rejectionJustification;
      }
      
      // Atualize o status e o usuário na solicitação
      // O trigger do banco de dados irá inserir o registro no histórico
      const { error } = await supabase
        .from('compras_solicitacoes')
        .update(updateData)
        .eq('id', parseInt(id));
      
      if (error) {
        console.error('Erro detalhado ao atualizar status:', error);
        throw error;
      }
      
      console.log(`Status da solicitação ${id} atualizado com sucesso para ${status}`);
      
      // Busque o histórico de status atualizado
      const { data: historyData, error: fetchHistoryError } = await supabase
        .from('compras_historico_status')
        .select('*')
        .eq('solicitacao_id', parseInt(id))
        .order('data_criacao', { ascending: false });
      
      if (fetchHistoryError) {
        console.error('Erro ao buscar histórico de status:', fetchHistoryError);
      }
      
      // Transforme os dados do histórico
      const statusHistory = historyData ? historyData.map((history: any) => ({
        id: history.id.toString(),
        status: history.status as Status,
        createdAt: history.data_criacao,
        userId: history.usuario_id.toString()
      })) : [];
      
      console.log(`Histórico de status recuperado: ${statusHistory.length} registros`);
      
      // Atualize o estado com o novo status e histórico
      setRequests(requests.map(r => r.id === id ? { 
        ...r, 
        status,
        statusHistory,
        userId, // Atualize também o userId da solicitação
        justificationRejection: rejectionJustification // Add the rejection justification to the request object
      } : r));
      
      toast({
        title: "Status atualizado",
        description: `Status atualizado para: ${status}`,
      });
    } catch (error) {
      console.error('Erro ao atualizar status da solicitação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da solicitação.",
        variant: "destructive",
      });
    }
  };
  
  // Delete request
  const deleteRequest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('compras_solicitacoes')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) throw error;
      
      setRequests(requests.filter(r => r.id !== id));
      
      toast({
        title: "Solicitação removida",
        description: "A solicitação foi removida com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting request:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a solicitação.",
        variant: "destructive",
      });
    }
  };
  
  // Get request by ID
  const getRequestById = (id: string) => {
    return requests.find(request => request.id === id);
  };

  return {
    requests,
    setRequests,
    fetchRequests,
    createRequest,
    updateRequest,
    deleteRequest,
    updateRequestStatus,
    getRequestById
  };
};
