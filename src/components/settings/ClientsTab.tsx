import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface ClientsTabProps {
  clients: any[];
  addClient: (client: any) => void;
  updateClient: (client: any) => void;
  deleteClient: (clientId: string) => void;
}

const ClientsTab: React.FC<ClientsTabProps> = ({
  clients,
  addClient,
  updateClient,
  deleteClient,
}) => {
  // Dialog states
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [isDeleteClientOpen, setIsDeleteClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  
  // Form states
  const [clientName, setClientName] = useState('');
  const [clientMunicipality, setClientMunicipality] = useState('');
  
  // Estado de busca
  const [termoBusca, setTermoBusca] = useState('');
  const [clientesFiltrados, setClientesFiltrados] = useState(clients);
  
  // Estados de paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const ITENS_POR_PAGINA = 5;
  const totalPaginas = Math.ceil(clientesFiltrados.length / ITENS_POR_PAGINA);
  
  // Atualizar clientes filtrados quando a busca mudar
  useEffect(() => {
    if (!termoBusca.trim()) {
      setClientesFiltrados(clients);
    } else {
      const termoLowerCase = termoBusca.toLowerCase();
      const resultado = clients.filter(client => 
        client.name.toLowerCase().includes(termoLowerCase) || 
        client.municipality.toLowerCase().includes(termoLowerCase)
      );
      setClientesFiltrados(resultado);
    }
    // Volta para a primeira página quando o filtro mudar
    setPaginaAtual(1);
  }, [termoBusca, clients]);
  
  // Clientes da página atual
  const clientesPaginados = clientesFiltrados.slice(
    (paginaAtual - 1) * ITENS_POR_PAGINA,
    paginaAtual * ITENS_POR_PAGINA
  );
  
  // Funções de navegação da paginação
  const irParaPaginaAnterior = () => {
    if (paginaAtual > 1) {
      setPaginaAtual(paginaAtual - 1);
    }
  };
  
  const irParaProximaPagina = () => {
    if (paginaAtual < totalPaginas) {
      setPaginaAtual(paginaAtual + 1);
    }
  };
  
  const resetClientForm = () => {
    setClientName('');
    setClientMunicipality('');
  };
  
  // Client handlers
  const handleAddClient = () => {
    addClient({
      name: clientName,
      municipality: clientMunicipality,
    });
    resetClientForm();
    setIsAddClientOpen(false);
  };
  
  const handleUpdateClient = () => {
    if (!selectedClient) return;
    updateClient({
      ...selectedClient,
      name: clientName,
      municipality: clientMunicipality,
    });
    resetClientForm();
    setIsEditClientOpen(false);
  };
  
  const handleDeleteClient = () => {
    if (!selectedClient) return;
    deleteClient(selectedClient.id);
    setIsDeleteClientOpen(false);
  };
  
  const openEditClientDialog = (client: any) => {
    setSelectedClient(client);
    setClientName(client.name);
    setClientMunicipality(client.municipality);
    setIsEditClientOpen(true);
  };
  
  const openDeleteClientDialog = (client: any) => {
    setSelectedClient(client);
    setIsDeleteClientOpen(true);
  };
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Clientes</CardTitle>
            <CardDescription>Gerencie os clientes do sistema</CardDescription>
          </div>
          <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal hover:bg-teal/90">
                <Plus size={16} className="mr-2" />
                Adicionar Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Cliente</DialogTitle>
                <DialogDescription>Preencha os dados para criar um novo cliente</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nome</Label>
                  <Input 
                    id="clientName" 
                    value={clientName} 
                    onChange={(e) => setClientName(e.target.value)} 
                    placeholder="Nome do cliente"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientMunicipality">Município</Label>
                  <Input 
                    id="clientMunicipality" 
                    value={clientMunicipality} 
                    onChange={(e) => setClientMunicipality(e.target.value)} 
                    placeholder="Município"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddClientOpen(false)}>Cancelar</Button>
                <Button className="bg-teal hover:bg-teal/90" onClick={handleAddClient}>Adicionar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar clientes por nome ou município..."
              className="w-full pl-8 bg-white"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Município</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientesPaginados.map(client => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.municipality}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => openEditClientDialog(client)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => openDeleteClientDialog(client)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {clientesFiltrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                      {termoBusca ? `Nenhum cliente encontrado para "${termoBusca}"` : "Nenhum cliente encontrado."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {clientesFiltrados.length > 0 && (
          <CardFooter className="flex items-center justify-between py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Mostrando {clientesPaginados.length} de {clientesFiltrados.length} clientes
              {clients.length !== clientesFiltrados.length && ` (filtrados de ${clients.length} no total)`}
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={irParaPaginaAnterior}
                disabled={paginaAtual === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="text-sm px-4 py-1 rounded border">
                {paginaAtual} / {totalPaginas || 1}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={irParaProximaPagina}
                disabled={paginaAtual === totalPaginas || totalPaginas === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
      
      {/* Edit Client Dialog */}
      <Dialog open={isEditClientOpen} onOpenChange={setIsEditClientOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>Atualize os dados do cliente</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editClientName">Nome</Label>
              <Input 
                id="editClientName" 
                value={clientName} 
                onChange={(e) => setClientName(e.target.value)} 
                placeholder="Nome do cliente"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editClientMunicipality">Município</Label>
              <Input 
                id="editClientMunicipality" 
                value={clientMunicipality} 
                onChange={(e) => setClientMunicipality(e.target.value)} 
                placeholder="Município"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditClientOpen(false)}>Cancelar</Button>
            <Button className="bg-teal hover:bg-teal/90" onClick={handleUpdateClient}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Client Dialog */}
      <AlertDialog open={isDeleteClientOpen} onOpenChange={setIsDeleteClientOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O cliente será removido permanentemente do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDeleteClient}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ClientsTab; 