import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/data/DataContext';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

// Componentes modularizados
import ClientsTab from '@/components/settings/ClientsTab';
import UnitsTab from '@/components/settings/UnitsTab';
import BudgetsTab from '@/components/settings/BudgetsTab';
import ItemsTab from '@/components/settings/ItemsTab';

// Dashboard will be our home page
const Settings = () => {
  const { user } = useAuth();
  const { 
    clients, 
    units, 
    budgets,
    items,
    addClient, 
    updateClient,
    deleteClient,
    addUnit,
    updateUnit,
    deleteUnit,
    addBudget,
    updateBudget,
    deleteBudget,
    addItem,
    updateItem,
    deleteItem,
    getClientById,
    loading,
    fetched,
  } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('clients');
  
  // Redirect if not admin
  if (user?.role !== 'admin') {
    navigate('/');
    return null;
  }
  
  // Debug: verificar dados na tela de configurações
  React.useEffect(() => {
    console.log("Settings - items:", items);
    console.log("Settings - loading:", loading);
    console.log("Settings - fetched:", fetched);
  }, [items, loading, fetched]);
  
  // Mostrar tela de carregamento enquanto os dados estão sendo buscados
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 rounded-full border-4 border-t-teal border-r-teal border-b-transparent border-l-transparent animate-spin"></div>
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configurações do Sistema</h2>
        <p className="text-muted-foreground">
          Gerencie os dados do sistema
        </p>
      </div>
      
      {/* Tabs for different settings */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-white border rounded-md p-1 mb-4 shadow-sm">
          <TabsTrigger 
            value="clients" 
            className="text-gray-700 hover:bg-gray-100 data-[state=active]:bg-teal data-[state=active]:text-white font-medium"
          >
            Clientes
          </TabsTrigger>
          <TabsTrigger 
            value="units" 
            className="text-gray-700 hover:bg-gray-100 data-[state=active]:bg-teal data-[state=active]:text-white font-medium"
          >
            Unidades
          </TabsTrigger>
          <TabsTrigger 
            value="budgets" 
            className="text-gray-700 hover:bg-gray-100 data-[state=active]:bg-teal data-[state=active]:text-white font-medium"
          >
            Rubricas
          </TabsTrigger>
          <TabsTrigger 
            value="items" 
            className="text-gray-700 hover:bg-gray-100 data-[state=active]:bg-teal data-[state=active]:text-white font-medium"
          >
            Itens
          </TabsTrigger>
        </TabsList>
        
        {/* Clientes Tab */}
        <TabsContent value="clients" className="p-0">
          <ClientsTab 
            clients={clients}
            addClient={addClient}
            updateClient={updateClient}
            deleteClient={deleteClient}
          />
        </TabsContent>
        
        {/* Unidades Tab */}
        <TabsContent value="units" className="p-0">
          <UnitsTab 
            units={units}
            clients={clients}
            addUnit={addUnit}
            updateUnit={updateUnit}
            deleteUnit={deleteUnit}
            getClientById={getClientById}
          />
        </TabsContent>
        
        {/* Rubricas Tab */}
        <TabsContent value="budgets" className="p-0">
          <BudgetsTab 
            budgets={budgets}
            clients={clients}
            addBudget={addBudget}
            updateBudget={updateBudget}
            deleteBudget={deleteBudget}
            getClientById={getClientById}
          />
        </TabsContent>
        
        {/* Itens Tab */}
        <TabsContent value="items" className="p-0">
          <ItemsTab 
            items={items}
            addItem={addItem}
            updateItem={updateItem}
            deleteItem={deleteItem}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
