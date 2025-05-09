import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Plus, Edit, Power, Search } from 'lucide-react';
import { formatPhoneNumber } from '@/utils/format';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";

const sectors = [
  'Engenharia Civil',
  'Manutenção',
  'Engenharia Clínica',
  'Tecnologia',
  'Administração',
  'Financeiro',
  'Recursos Humanos',
];

const UserManagement = () => {
  const { users, addUser, updateUser, toggleUserStatus, user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Adicionar estado para o termo de pesquisa
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form states
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sector, setSector] = useState(sectors[0]);
  const [role, setRole] = useState<'admin' | 'normal'>('normal');
  const [status, setStatus] = useState<'ativo' | 'inativo'>('ativo');
  
  // Redirect if not admin
  if (currentUser?.role !== 'admin') {
    navigate('/');
    return null;
  }
  
  const resetForm = () => {
    setName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setWhatsapp('');
    setSector(sectors[0]);
    setRole('normal');
    setStatus('ativo');
  };
  
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({
      name,
      lastName,
      email,
      password,
      whatsapp,
      sector,
      role,
      status,
    });
    resetForm();
    setIsAddDialogOpen(false);
  };
  
  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    updateUser({
      ...selectedUser,
      name,
      lastName,
      email,
      password: password || selectedUser.password,
      whatsapp,
      sector,
      role,
      status,
    });
    resetForm();
    setIsEditDialogOpen(false);
  };
  
  const handleToggleUserStatus = () => {
    if (!selectedUser) return;
    toggleUserStatus(selectedUser.id);
    setIsStatusDialogOpen(false);
  };
  
  const openEditDialog = (user: any) => {
    setSelectedUser(user);
    setName(user.name);
    setLastName(user.lastName);
    setEmail(user.email);
    setPassword('');
    setWhatsapp(user.whatsapp);
    setSector(user.sector);
    setRole(user.role);
    setStatus(user.status);
    setIsEditDialogOpen(true);
  };
  
  const openStatusDialog = (user: any) => {
    setSelectedUser(user);
    setIsStatusDialogOpen(true);
  };
  
  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWhatsapp(formatPhoneNumber(e.target.value));
  };
  
  // Filtrar usuários com base no termo de pesquisa
  const filteredUsers = users.filter(user => 
    `${user.name} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de Usuários</h2>
          <p className="text-muted-foreground">
            Gerencie os usuários que podem acessar o sistema
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal hover:bg-teal/90">
              <Plus size={16} className="mr-2" />
              Adicionar Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Usuário</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar um novo usuário
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleAddUser}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Nome"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input 
                      id="lastName" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)} 
                      placeholder="Sobrenome"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="email@exemplo.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input 
                    id="whatsapp" 
                    value={whatsapp} 
                    onChange={handleWhatsappChange} 
                    placeholder="(99) 9 9999-9999"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sector">Setor</Label>
                  <Select value={sector} onValueChange={setSector} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Permissão</Label>
                  <Select value={role} onValueChange={(value: 'admin' | 'normal') => setRole(value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de permissão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(value: 'ativo' | 'inativo') => setStatus(value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-teal hover:bg-teal/90">Adicionar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Filtro de pesquisa */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Buscar usuários por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>
      
      {/* Table of users */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Permissão</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className={user.status === 'inativo' ? 'opacity-60' : ''}>
                  <TableCell className="font-medium">{user.name} {user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.whatsapp}</TableCell>
                  <TableCell>{user.sector}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      user.role === 'admin' 
                        ? 'bg-blue text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'Normal'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${
                      user.status === 'ativo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => openEditDialog(user)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className={user.status === 'ativo' ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'}
                      onClick={() => openStatusDialog(user)}
                    >
                      <Power size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    {searchTerm ? "Nenhum usuário encontrado com este termo de busca." : "Nenhum usuário encontrado."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize os dados do usuário
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUpdateUser}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome</Label>
                  <Input 
                    id="edit-name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Nome"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-lastName">Sobrenome</Label>
                  <Input 
                    id="edit-lastName" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    placeholder="Sobrenome"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-password">
                  Senha <span className="text-xs text-muted-foreground">(deixe em branco para manter a atual)</span>
                </Label>
                <Input 
                  id="edit-password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-whatsapp">WhatsApp</Label>
                <Input 
                  id="edit-whatsapp" 
                  value={whatsapp} 
                  onChange={handleWhatsappChange} 
                  placeholder="(99) 9 9999-9999"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-sector">Setor</Label>
                <Select value={sector} onValueChange={setSector} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o setor" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-role">Permissão</Label>
                <Select value={role} onValueChange={(value: 'admin' | 'normal') => setRole(value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de permissão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={status} onValueChange={(value: 'ativo' | 'inativo') => setStatus(value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-teal hover:bg-teal/90">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Toggle Status Dialog */}
      <AlertDialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedUser?.status === 'ativo' ? 'Desativar Usuário?' : 'Ativar Usuário?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.status === 'ativo' 
                ? `Isso impedirá ${selectedUser?.name} ${selectedUser?.lastName} de fazer login no sistema.`
                : `Isso permitirá que ${selectedUser?.name} ${selectedUser?.lastName} faça login no sistema novamente.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleUserStatus}
              className={selectedUser?.status === 'ativo' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}
            >
              {selectedUser?.status === 'ativo' ? 'Desativar' : 'Ativar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
