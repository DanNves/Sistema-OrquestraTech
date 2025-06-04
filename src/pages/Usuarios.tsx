import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { 
  User, 
  UserPlus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Shield, 
  Mail, 
  UserCheck,
  UserX,
  Check,
  X
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import axios from 'axios';

// Define the allowed status types
type UserStatus = 'active' | 'inactive' | 'pending';

// REMOVER dados mockados
// const initialUsers = [
//   {
//     id: 1,
//     name: 'Ana Silva',
//     email: 'ana.silva@email.com',
//     role: 'Administrador',
//     status: 'active' as UserStatus,
//     team: 'Coral',
//     lastAccess: '2023-05-18T15:30:22',
//     avatar: null,
//   },
//   // ... outros usuários mockados
// ];

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  team: string;
  lastAccess: string;
  avatar: string | null;
  equipeId?: string; // Mantido para compatibilidade com o backend, mas não usado no form
  tipo?: string; // Adicionar tipo opcionalmente caso o backend ainda retorne assim
}

type UserFormData = {
  id?: number;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  team: string;
  password?: string; // Adicionar campo de senha (opcional, usado na criação/edição)
  confirmPassword?: string; // Adicionar campo de confirmação de senha (opcional, usado na criação)
}

const Usuarios = () => {
  const { toast } = useToast();
  // Estados para os dados dos usuários
  const [users, setUsers] = useState<User[]>([]); // Começar com array vazio
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]); // Começar com array vazio
  // Estados para loading e erro da busca de usuários
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  // Adicionar estado para loading/erro na submissão do formulário (criar/editar)
  const [submittingUser, setSubmittingUser] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [userToApprove, setUserToApprove] = useState<User | null>(null);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [currentUser, setCurrentUser] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'Músico',
    status: 'active',
    team: '',
    password: '', // Inicializar campos de senha
    confirmPassword: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('todos');

  // Hook para buscar usuários do backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await axios.get<User[]>('http://localhost:3001/api/usuarios');
        console.log("Usuários recebidos do backend:", response.data); // LOG temporário
        // Mapear o campo 'ativo' (boolean) do backend para 'status' (UserStatus) do frontend
        const mappedUsers = response.data.map(user => ({
           ...user,
           status: user.ativo === false ? 'inactive' : (user.status || 'active') // Mapear ativo=false para 'inactive', manter status existente (para 'pending') ou default 'active'
        }));
        setUsers(mappedUsers);
        setFilteredUsers(applyFilters(mappedUsers, searchQuery, statusFilter)); // Aplicar filtros iniciais na lista mapeada
      } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        setUsersError('Não foi possível carregar os usuários.');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []); // Dependências: array vazio para executar apenas uma vez

  // Handler functions
  const handleAddUser = () => {
    setIsEditMode(false);
    setCurrentUser({
      name: '',
      email: '',
      role: 'Músico',
      status: 'active',
      team: '',
      password: '', // Inicializar campos de senha
      confirmPassword: '',
    });
    // Resetar erros de submissão
    setSubmitError(null);
    setIsAddUserOpen(true);
  };

  const handleEditUser = async (user: User) => { // Tornar assíncrona para buscar dados
    setIsEditMode(true);
    setSubmittingUser(true); // Indicar loading enquanto busca dados
    setSubmitError(null); // Resetar erros de submissão

    try {
      // Buscar dados completos do usuário do backend
      const response = await axios.get<User>(`http://localhost:3001/api/usuarios/${user.id}`);
      const userData = response.data;

      setCurrentUser({
        id: userData.id, // Usar ID retornado pelo backend
        name: userData.nome, // Mapear nome do backend para name do frontend
        email: userData.email,
        role: userData.tipo || '', // Mapear tipo do backend para role do frontend, usar string vazia se null
        status: userData.status, // Incluir status na edição
        team: userData.equipeId || '', // Mapear equipeId do backend para team do frontend, usar string vazia se null
        password: '', // Manter campos de senha vazios na edição por padrão
        confirmPassword: '',
      });
      setIsAddUserOpen(true);

    } catch (error: any) {
      console.error('Erro ao buscar usuário para edição:', error);
      const errorMessage = error.response?.data?.message || error.message;
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados do usuário",
        description: `Não foi possível carregar os detalhes do usuário para edição. Detalhes: ${errorMessage}`,
      });
      // Fechar modal ou manter aberto com erro, dependendo da UX desejada
      // Por enquanto, vamos fechar
      setIsAddUserOpen(false);

    } finally {
      setSubmittingUser(false); // Finalizar loading
    }
  };

  const handleDeleteClick = (userId: number) => {
    setUserToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => { // Tornar assíncrona para chamar o backend
    if (userToDelete !== null) {
      try {
        // Chamar a rota DELETE /api/usuarios/:id/hard-delete para exclusão permanente
        const response = await axios.delete(`http://localhost:3001/api/usuarios/${userToDelete}/hard-delete`);

        if (response.status === 204) { // HTTP 204 No Content (sucesso para exclusão permanente)
          // Remover o usuário do estado local completamente após exclusão permanente
          const updatedUsers = users.filter(user => user.id !== userToDelete);
          setUsers(updatedUsers);
          // Reaplicar filtros na lista atualizada
          setFilteredUsers(applyFilters(updatedUsers, searchQuery, statusFilter));

          toast({
            title: "Usuário excluído permanentemente",
            description: "O usuário foi removido do sistema.",
          });
        } else {
           // Tratar outros códigos de sucesso se necessário
          toast({
            variant: "destructive",
            title: "Erro ao excluir usuário",
            description: `Resposta inesperada do servidor: ${response.status}`,
          });
        }

      } catch (error: any) {
        console.error('Erro ao excluir usuário:', error);
        const errorMessage = error.response?.data?.message || error.message;
        toast({
          variant: "destructive",
          title: "Erro ao excluir usuário",
          description: `Não foi possível excluir o usuário. Detalhes: ${errorMessage}`,
        });
      }

      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'status') {
      // Ensure status is one of the allowed values
      const typedValue = (value === 'active' || value === 'inactive' || value === 'pending') 
        ? value as UserStatus 
        : 'active';
      setCurrentUser(prev => ({ ...prev, [name]: typedValue }));
    } else {
      setCurrentUser(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleStatusChange = (userId: number) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        // Ensure we use the correct type for the status
        const newStatus: UserStatus = user.status === 'active' ? 'inactive' : 'active';
        return { ...user, status: newStatus };
      }
      return user;
    });
    setUsers(updatedUsers);
    setFilteredUsers(applyFilters(updatedUsers, searchQuery, statusFilter));
    
    const targetUser = users.find(u => u.id === userId);
    const newStatus = targetUser?.status === 'active' ? 'inativo' : 'ativo';
    
    toast({
      title: "Status atualizado",
      description: `Usuário agora está ${newStatus}.`,
    });
  };

  const applyFilters = (userList: User[], query: string, status: string): User[] => {
    let result = [...userList];
    
    // Apply search query
    if (query.trim()) {
      const lowercaseQuery = query.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(lowercaseQuery) || 
        user.email.toLowerCase().includes(lowercaseQuery) ||
        user.role.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    // Apply status filter
    if (status !== 'all') {
      const typedStatus = status as UserStatus;
      result = result.filter(user => user.status === typedStatus);
    } else {
        // Se o status for 'all', filtrar apenas usuários pendentes
        result = result.filter(user => user.status !== 'pending');
    }

    // Log temporário para depuração da filtragem após exclusão
    console.log(`Aplicando filtros: query='${query}', status='${status}'`);
    console.log("Lista original para filtrar:", userList);
    console.log("Lista filtrada:", result);
    
    return result;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFilteredUsers(applyFilters(users, query, statusFilter));
  };

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    setFilteredUsers(applyFilters(users, searchQuery, status));
  };

  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar senhas no modo de criação
    if (!isEditMode) {
      if (currentUser.password !== currentUser.confirmPassword) {
        toast({
          variant: "destructive",
          title: "Erro de Senha",
          description: "As senhas não coincidem.",
        });
        return; // Impedir submissão se senhas não coincidirem
      }
    }

    // Preparar os dados a serem enviados
    const userDataToSend: any = {
      nome: currentUser.name, // Mapear name para nome do backend
      email: currentUser.email,
      tipo: currentUser.role, // Mapear role para tipo do backend
      // Outros campos como genero, idade, ultimoEvento não estão no formulário atual
    };

    // Incluir password APENAS no modo de criação se preenchido
    if (!isEditMode && currentUser.password) {
        userDataToSend.password = currentUser.password; // Enviar senha para criação
    }

    // No modo de edição, podemos opcionalmente permitir a atualização da senha
    // Se os campos password e confirmPassword estiverem preenchidos e coincidirem na edição,
    // enviamos a nova senha para o backend. Caso contrário, não enviamos.
    if (isEditMode && currentUser.password && currentUser.password === currentUser.confirmPassword) {
        userDataToSend.password = currentUser.password; // Enviar nova senha para atualização
    } else if (isEditMode && currentUser.password && currentUser.password !== currentUser.confirmPassword) {
         // Validar senhas não coincidentes na edição também
         toast({
          variant: "destructive",
          title: "Erro de Senha",
          description: "As senhas de atualização não coincidem.",
        });
        return; // Impedir submissão
    }

    setSubmittingUser(true); // Indicar loading durante a submissão
    setSubmitError(null); // Resetar erros de submissão

    if (isEditMode && currentUser.id) {
      // Lógica para atualizar usuário existente
      try {
        // Chamar a rota PUT /api/usuarios/:id
        const response = await axios.put(`http://localhost:3001/api/usuarios/${currentUser.id}`, userDataToSend);

        if (response.status === 200) { // HTTP 200 OK
          toast({
            title: "Usuário atualizado",
            description: "Os dados do usuário foram atualizados com sucesso.",
          });
          // Atualizar o estado local para refletir o usuário editado
          const updatedUsers = users.map(user => {
            // Certificar que estamos comparando com o id correto
            if (user.id.toString() === currentUser.id?.toString()) {
              // Mesclar os dados existentes com os dados retornados pelo backend
              // O backend em updateUsuario já retorna o usuário atualizado
              return { ...user, ...response.data };
            }
            return user;
          });
          setUsers(updatedUsers);
          // Reaplicar filtros para atualizar a lista exibida
          setFilteredUsers(applyFilters(updatedUsers, searchQuery, statusFilter));

        } else {
          // Tratar outros códigos de sucesso se necessário
          toast({
            variant: "destructive",
            title: "Erro ao atualizar usuário",
            description: `Resposta inesperada do servidor: ${response.status}`,
          });
        }
      } catch (error: any) {
        console.error('Erro ao atualizar usuário:', error);
        // Exibir mensagem de erro do backend se disponível
        const errorMessage = error.response?.data?.message || error.message;
        // Tratar erro de email duplicado na atualização
        if (error.response && error.response.status === 409) { // HTTP 409 Conflict (email duplicado)
             toast({
                variant: "destructive",
                title: "Erro de Atualização",
                description: "Este email já está sendo usado por outro usuário.",
            });
        } else {
            toast({
              variant: "destructive",
              title: "Erro ao atualizar usuário",
              description: `Detalhes: ${errorMessage}`,
            });
        }
      }
      
      setIsAddUserOpen(false);

    } else {
      // Lógica para adicionar novo usuário (já implementada, apenas ajustando envio da senha)
      try {
        // Chamar a rota POST /api/usuarios
        const response = await axios.post('http://localhost:3001/api/usuarios', userDataToSend);
        
        if (response.status === 201) { // HTTP 201 Created
          toast({
            title: "Usuário adicionado",
            description: "Novo usuário adicionado com sucesso.",
          });
          // Adicionar o novo usuário retornado pelo backend ao estado local
          const newUser = response.data; // O backend deve retornar o usuário criado
          const updatedUsers = [...users, newUser];
          setUsers(updatedUsers);
          // Reaplicar filtros para atualizar a lista exibida
          setFilteredUsers(applyFilters(updatedUsers, searchQuery, statusFilter));

        } else {
          // Tratar outros códigos de sucesso se necessário
          toast({
            variant: "destructive",
            title: "Erro ao adicionar usuário",
            description: `Resposta inesperada do servidor: ${response.status}`,
          });
        }
      } catch (error: any) {
        console.error('Erro ao adicionar usuário:', error);
        // Exibir mensagem de erro do backend se disponível
        const errorMessage = error.response?.data?.message || error.message;
        // Tratar erro de email duplicado na criação
        if (error.response && error.response.status === 409) { // HTTP 409 Conflict (email duplicado)
             toast({
                variant: "destructive",
                title: "Erro de Cadastro",
                description: "Este email já está sendo usado por outro usuário.",
            });
        } else {
            toast({
              variant: "destructive",
              title: "Erro ao adicionar usuário",
              description: `Detalhes: ${errorMessage}`,
            });
        }
      }
      
      setIsAddUserOpen(false);
    }

  };

  const handleApprovalClick = (user: User, action: 'approve' | 'reject') => {
    setUserToApprove(user);
    setApprovalAction(action);
    setIsApprovalDialogOpen(true);
  };

  const handleApprovalConfirm = async () => { // Tornar assíncrona
    if (!userToApprove) return;

    setSubmittingUser(true); // Indicar loading
    setSubmitError(null); // Resetar erros

    const newStatus = approvalAction === 'approve' ? 'active' : 'inactive';

    try {
      // Chamar a rota PUT /api/usuarios/:id para atualizar o status
      const response = await axios.put(`http://localhost:3001/api/usuarios/${userToApprove.id}`, {
        status: newStatus
      });

      if (response.status === 200) { // HTTP 200 OK
        // Atualizar o estado local com o novo status
        const updatedUsers = users.map(user => {
          if (user.id === userToApprove.id) {
            return { ...user, status: newStatus as UserStatus };
          }
          return user;
        });

        setUsers(updatedUsers);
        setFilteredUsers(applyFilters(updatedUsers, searchQuery, statusFilter));

        toast({
          title: approvalAction === 'approve' ? "Usuário aprovado" : "Usuário rejeitado",
          description: approvalAction === 'approve'
            ? `${userToApprove.name} foi aprovado e está ativo no sistema.`
            : `${userToApprove.name} foi rejeitado e está inativo no sistema.`,
        });

      } else {
        // Tratar outros códigos de sucesso
        toast({
          variant: "destructive",
          title: `Erro ao ${approvalAction === 'approve' ? 'aprovar' : 'rejeitar'} usuário`,
          description: `Resposta inesperada do servidor: ${response.status}`,
        });
      }

    } catch (error: any) {
      console.error(`Erro ao ${approvalAction === 'approve' ? 'aprovar' : 'rejeitar'} usuário:`, error);
      const errorMessage = error.response?.data?.message || error.message;
      toast({
        variant: "destructive",
        title: `Erro ao ${approvalAction === 'approve' ? 'aprovar' : 'rejeitar'} usuário`,
        description: `Não foi possível ${approvalAction === 'approve' ? 'aprovar' : 'rejeitar'} o usuário. Detalhes: ${errorMessage}`,
      });
    }

    // Finalizar loading e fechar o dialog
    setSubmittingUser(false);
    setIsApprovalDialogOpen(false);
    setUserToApprove(null);
  };

  // Get the formatted date for display
  const getFormattedDate = (dateString: string) => {
    if (!dateString) return 'Nunca acessou';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Data inválida';
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get status badge color
  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <UserCheck className="w-3 h-3 mr-1" />
            Ativo
          </Badge>
        );
      case 'inactive':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <UserX className="w-3 h-3 mr-1" />
            Inativo
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <User className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Define available roles and teams for the forms
  const availableRoles = [
    'Músico',
    'Organista',
    'Instrutor(a)',
    'Candidato(a)',
    'Encarregado Local',
    'Encarregado Regional',
    'Examinadora'
  ];
  // const availableTeams = ['Coral', 'Banda', 'Técnica', 'Mídias', 'Administração']; // Times estão removidos

  // Filter users with pending status for the approval section
  const pendingUsers = users.filter(user => user.status === 'pending');

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
              <div>
                <CardTitle className="text-2xl font-bold">Gerenciamento de Usuários</CardTitle>
                <CardDescription>
                  Adicione, edite e gerencie os usuários do sistema
                </CardDescription>
              </div>
              <Button onClick={handleAddUser} className="md:self-end">
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Usuário
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid grid-cols-2 md:w-[400px] mb-4">
                <TabsTrigger value="todos">Todos os Usuários</TabsTrigger>
                <TabsTrigger 
                  value="pendentes" 
                  className="relative"
                >
                  Solicitações Pendentes
                  {pendingUsers.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {pendingUsers.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="todos" className="space-y-4">
                {/* Search and filter section */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="text"
                      placeholder="Buscar usuários..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={statusFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFilterChange('all')}
                      className="whitespace-nowrap"
                    >
                      Todos
                    </Button>
                    <Button
                      variant={statusFilter === 'active' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFilterChange('active')}
                      className="whitespace-nowrap"
                    >
                      <UserCheck className="w-4 h-4 mr-1" /> Ativos
                    </Button>
                    <Button
                      variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFilterChange('inactive')}
                      className="whitespace-nowrap"
                    >
                      <UserX className="w-4 h-4 mr-1" /> Inativos
                    </Button>
                  </div>
                </div>

                {/* Users table - All users */}
                {loadingUsers ? (
                  <div className="text-center py-8 text-gray-500">Carregando usuários...</div>
                ) : usersError ? (
                  <div className="text-center py-8 text-red-500">{usersError}</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuário</TableHead>
                        <TableHead className="hidden md:table-cell">Cargo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">Último Acesso</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                                  {user.avatar ? (
                                    <img 
                                      src={user.avatar} 
                                      alt={user.name}
                                      className="h-full w-full object-cover rounded-full"
                                    />
                                  ) : (
                                    <User className="h-5 w-5" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{user.name}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex items-center gap-2 text-gray-700">
                                <Shield className="h-4 w-4 text-primary-600 flex-shrink-0" />
                                {user.role && typeof user.role === 'string' && user.role.trim() !== '' ? (
                                  <span className="text-sm font-medium truncate">{user.role}</span>
                                ) : user.tipo && typeof user.tipo === 'string' && user.tipo.trim() !== '' ? (
                                  <span className="text-sm font-medium text-gray-500 truncate">{user.tipo}</span>
                                ) : (
                                  <span className="text-sm font-medium text-gray-500">Sem cargo</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(user.status)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-sm">
                              {getFormattedDate(user.lastAccess)}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-5 w-5" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-white">
                                  <DropdownMenuItem 
                                    className="cursor-pointer flex items-center gap-2"
                                    onClick={() => handleEditUser(user)}
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span>Editar</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="cursor-pointer flex items-center gap-2"
                                    onClick={() => handleStatusChange(user.id)}
                                  >
                                    {user.status === 'active' ? (
                                      <>
                                        <UserX className="h-4 w-4 text-amber-600" />
                                        <span className="text-amber-600">Desativar</span>
                                      </>
                                    ) : (
                                      <>
                                        <UserCheck className="h-4 w-4 text-green-600" />
                                        <span className="text-green-600">Ativar</span>
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="cursor-pointer flex items-center gap-2 text-red-600"
                                    onClick={() => handleDeleteClick(user.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span>Excluir</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10">
                            <div className="flex flex-col items-center justify-center text-gray-500">
                              <User className="h-10 w-10 mb-2" />
                              <h3 className="text-lg font-medium">Nenhum usuário encontrado</h3>
                              <p>Tente ajustar os filtros ou adicione um novo usuário.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}

                {/* Pagination */}
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </TabsContent>
              
              {/* Pending Approvals Tab */}
              <TabsContent value="pendentes" className="space-y-4">
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl text-yellow-800">Solicitações Pendentes</CardTitle>
                    <CardDescription className="text-yellow-700">
                      Aprove ou rejeite os usuários que solicitaram acesso ao sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {pendingUsers.length > 0 ? (
                      <div className="border rounded-md bg-white">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Usuário</TableHead>
                              <TableHead className="hidden md:table-cell">Cargo</TableHead>
                              <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pendingUsers.map((user) => (
                              <TableRow key={user.id} className="hover:bg-yellow-50/50 transition-colors">
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                                      {user.avatar ? (
                                        <img 
                                          src={user.avatar} 
                                          alt={user.name}
                                          className="h-full w-full object-cover rounded-full"
                                        />
                                      ) : (
                                        <User className="h-5 w-5" />
                                      )}
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-900">{user.name}</div>
                                      <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-yellow-600" />
                                    {user.role}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-red-600 border-red-200 hover:bg-red-50"
                                      onClick={() => handleApprovalClick(user, 'reject')}
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Rejeitar
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-green-600 border-green-200 hover:bg-green-50"
                                      onClick={() => handleApprovalClick(user, 'approve')}
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Aprovar
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <UserCheck className="h-12 w-12 text-green-500 mb-2" />
                        <h3 className="text-lg font-medium">Não há solicitações pendentes</h3>
                        <p className="text-gray-500">Todas as solicitações de usuários foram processadas.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Add/Edit User Dialog */}
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
              </DialogTitle>
              <DialogDescription>
                {isEditMode
                  ? 'Edite os detalhes do usuário abaixo.'
                  : 'Preencha os detalhes do novo usuário abaixo.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitUser} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nome completo
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={currentUser.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={currentUser.email}
                      onChange={handleFormChange}
                      className="pl-9 pr-2"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="role" className="text-sm font-medium">
                    Cargo
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={currentUser.role}
                    onChange={handleFormChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    {availableRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                
                {isEditMode && (
                  <div className="grid gap-2">
                    <label htmlFor="status" className="text-sm font-medium">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={currentUser.status}
                      onChange={handleFormChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                      <option value="pending">Pendente</option>
                    </select>
                  </div>
                )}
                
                {!isEditMode && ( // Mostrar campos de senha apenas no modo de criação
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <label htmlFor="password" className="text-sm font-medium">
                        Senha
                      </label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={currentUser.password || ''} // Adicionar ao estado e lidar com undefined
                        onChange={handleFormChange}
                        required // Senha é obrigatória na criação
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="confirmPassword" className="text-sm font-medium">
                        Confirmar Senha
                      </label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={currentUser.confirmPassword || ''} // Adicionar ao estado e lidar com undefined
                        onChange={handleFormChange}
                        required // Confirmação de senha é obrigatória na criação
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {isEditMode ? 'Salvar alterações' : 'Adicionar usuário'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir este usuário? Esta ação irá desativá-lo no sistema.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Approval/Rejection Confirmation Dialog */}
        <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {approvalAction === 'approve' ? 'Confirmar aprovação' : 'Confirmar rejeição'}
              </DialogTitle>
              <DialogDescription>
                {approvalAction === 'approve'
                  ? `Você está prestes a aprovar o acesso de ${userToApprove?.name}. Confirmar?`
                  : `Você está prestes a rejeitar o acesso de ${userToApprove?.name}. Confirmar?`
                }
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsApprovalDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                variant={approvalAction === 'approve' ? 'default' : 'destructive'} 
                onClick={handleApprovalConfirm}
              >
                {approvalAction === 'approve' ? 'Aprovar' : 'Rejeitar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Usuarios;
