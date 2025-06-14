import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Users, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Equipe {
  id: string;
  nome: string;
  eventos: string[];
  integrantes: string[];
  mediaPontuacao: number;
  presencaMedia: number;
  created_at?: string;
  updated_at?: string;
  responsavel?: string;
  maxmembros: number;
}

interface Evento {
  id: string;
  nome: string;
  status: string;
}

interface Usuario {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
  // Adicionar outros campos de usuário relevantes se necessário
}

const Equipes = () => {
  const [teams, setTeams] = useState<Equipe[]>([]);
  const [events, setEvents] = useState<Evento[]>([]);
  const [users, setUsers] = useState<Usuario[]>([]); // Estado para armazenar usuários
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Equipe | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    eventoId: '',
    leader: '',
    members: 0,
  });

  // Lista de usuários que não estão em nenhuma equipe e estão ativos
  const [availableUsers, setAvailableUsers] = useState<Usuario[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [usersLoading, setUsersLoading] = useState(true); // Estado para loading de usuários
  const [usersError, setUsersError] = useState<string | null>(null); // Estado para erro de usuários

  // Estado para controlar o usuário selecionado para adicionar à equipe
  const [userToAddId, setUserToAddId] = useState<string>('');

  // Novos estados para a funcionalidade de busca de usuários
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [filteredUsersForAdd, setFilteredUsersForAdd] = useState<Usuario[]>([]);

  // Estado e função para o modal de detalhes da equipe
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [teamDetails, setTeamDetails] = useState<Equipe | null>(null);

  // Efeito para popular o campo members no formData ao abrir o modal de edição
  useEffect(() => {
    if (editingTeam) {
      setFormData(prevData => ({
        ...prevData,
        members: editingTeam.maxmembros !== undefined && editingTeam.maxmembros !== null ? editingTeam.maxmembros : 0,
      }));
    } else {
       // Resetar members para 0 ao fechar o modal de edição ou abrir o de criação
       setFormData(prevData => ({
         ...prevData,
         members: 0,
       }));
    }
  }, [editingTeam]); // Depende do estado editingTeam

  const fetchEquipes = async () => {
    try {
      setLoading(true);
      console.log('Iniciando busca de equipes...');

      const response = await axios.get<Equipe[]>('http://localhost:3001/api/equipes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      console.log('Resposta da API (equipes):', response.data);
      setTeams(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar equipes:', err);
      setError('Não foi possível carregar as equipes.');
      setLoading(false);
    }
  };

  // Efeito para filtrar usuários disponíveis (livres e ativos)
  useEffect(() => {
    // IDs de todos os integrantes de todas as equipes
    const allTeamMemberIds = new Set<string>();
    teams.forEach(team => {
      if (Array.isArray(team.integrantes)) {
        team.integrantes.forEach(memberId => allTeamMemberIds.add(memberId));
      }
    });

    // Filtrar usuários que não estão em nenhuma equipe e estão ativos
    const filtered = users.filter(user => 
      !allTeamMemberIds.has(user.id) && user.ativo === true
    );
    setAvailableUsers(filtered);
  }, [users, teams]); // Depende da lista de usuários e equipes

  // Efeito para filtrar usuários conforme a busca no campo 'Adicionar Membro'
  useEffect(() => {
    if (memberSearchQuery.trim() === '') {
      setFilteredUsersForAdd(availableUsers); // Mostra todos os disponíveis se a busca estiver vazia
      return;
    }
    const lowerCaseQuery = memberSearchQuery.toLowerCase();
    const filtered = availableUsers.filter(user => 
      user.nome.toLowerCase().includes(lowerCaseQuery) || user.email.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredUsersForAdd(filtered);
  }, [memberSearchQuery, availableUsers]); // Depende da query de busca e dos usuários disponíveis

  useEffect(() => {
    fetchEquipes();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get<Evento[]>('http://localhost:3001/api/eventos');
        setEvents(response.data);
        setEventsLoading(false);
      } catch (err) {
        console.error('Erro ao buscar eventos:', err);
        setEventsError('Não foi possível carregar a lista de eventos.');
        setEventsLoading(false);
      }
    };

    fetchEvents();

    // Configurar polling para buscar eventos a cada 30 segundos
    const pollingInterval = setInterval(fetchEvents, 30000); // 30000 ms = 30 segundos

    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(pollingInterval);

  }, []); // Executar apenas uma vez ao montar o componente

  useEffect(() => {
    // Novo useEffect para buscar usuários
    const fetchUsers = async () => {
      try {
        const response = await axios.get<Usuario[]>('http://localhost:3001/api/usuarios');
        setUsers(response.data);
        setUsersLoading(false);
      } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        setUsersError('Não foi possível carregar a lista de usuários.');
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, []); // Executar apenas uma vez ao montar o componente

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log('[%s] [handleInputChange] Campo %s, Valor: %s', new Date().toISOString(), name, value);
    setFormData({
      ...formData,
      [name as 'nome' | 'eventoId' | 'leader' | 'members']: name === 'members' ? parseInt(value) || 0 : value
    });
     console.log('[%s] [handleInputChange] formData.members após atualização: %d', new Date().toISOString(), parseInt(value) || 0);
  };

  const openCreateModal = () => {
    console.log('[%s] [openCreateModal] Abrindo modal de criação.', new Date().toISOString());
    setEditingTeam(null);
    setFormData({
      nome: '',
      eventoId: '',
      leader: '',
      members: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = async (team: Equipe) => {
    try {
      console.log('[%s] [openEditModal] Buscando detalhes para equipe ID:', new Date().toISOString(), team.id);
      const response = await axios.get<Equipe>(`http://localhost:3001/api/equipes/${team.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const latestTeam = response.data;
      console.log('[%s] [openEditModal] Detalhes recebidos do backend:', new Date().toISOString(), latestTeam);

      setEditingTeam(latestTeam);
    setFormData({
        nome: latestTeam.nome,
        eventoId: latestTeam.eventos && latestTeam.eventos.length > 0 ? latestTeam.eventos[0] : '',
        leader: latestTeam.responsavel || '',
        // Popular o campo members com o valor de maxmembros do backend, ou 0 se não existir/inválido
        members: latestTeam.maxmembros !== undefined && latestTeam.maxmembros !== null && !isNaN(latestTeam.maxmembros) ? latestTeam.maxmembros : 0,
      });
      console.log('[%s] [openEditModal] formData populado com members:', new Date().toISOString(), latestTeam.maxmembros !== undefined && latestTeam.maxmembros !== null && !isNaN(latestTeam.maxmembros) ? latestTeam.maxmembros : 0);
    setIsModalOpen(true);
    } catch (error) {
      console.error('Erro ao carregar detalhes da equipe para edição:', error);
      toast({
        title: "Erro",
        description: `Não foi possível carregar os detalhes da equipe para edição. Detalhes: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  const closeModal = () => {
    console.log('[%s] [closeModal] Fechando modal.', new Date().toISOString());
    setIsModalOpen(false);
    setEditingTeam(null); // Resetar editingTeam ao fechar o modal
     // Resetar formData.members para 0 ao fechar o modal
     setFormData(prevData => ({ ...prevData, members: 0 }));
  };

  // Função para adicionar um usuário à equipe
  const handleAddMember = async () => {
    if (!editingTeam || !userToAddId) return;

    // Validar se o usuário a ser adicionado está livre e ativo
    const userToAdd = availableUsers.find(u => u.id === userToAddId);
    if (!userToAdd) {
      toast({
        title: "Usuário Não Disponível",
        description: "O usuário selecionado já está em uma equipe ou não está ativo.",
        variant: "destructive",
      });
      return;
    }

    try {
      const updatedEquipe = (await axios.post(`http://localhost:3001/api/equipes/${editingTeam.id}/integrantes/${userToAddId}`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })).data;

      setTeams(teams.map(team => team.id === updatedEquipe.id ? updatedEquipe : team));
      setEditingTeam(updatedEquipe); // Atualizar a equipe sendo editada na modal com os novos integrantes
      setUserToAddId('');
      setMemberSearchQuery('');

      toast({
        title: "Membro Adicionado",
        description: "Usuário adicionado à equipe com sucesso.",
      });

    } catch (error) {
      console.error('Erro ao adicionar membro à equipe:', error);
      // Verificar se o erro é do backend indicando limite excedido
      if (axios.isAxiosError(error) && error.response?.status === 400 && error.response.data?.message?.includes('limite máximo')) {
         toast({
            title: "Limite de Membros",
            description: error.response.data.message,
            variant: "destructive",
         });
    } else {
        toast({
          title: "Erro",
          description: `Não foi possível adicionar o membro. Detalhes: ${(error as Error).message}`,
          variant: "destructive",
        });
      }
    }
  };

  // Função para remover um usuário da equipe
  const handleRemoveMember = async (usuarioId: string) => {
    if (!editingTeam) return;

    try {
      // Chamar o endpoint DELETE /api/equipes/:equipeId/integrantes/:usuarioId
      const updatedEquipe = (await axios.delete(`http://localhost:3001/api/equipes/${editingTeam.id}/integrantes/${usuarioId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })).data;

      // Atualizar o estado da equipe no frontend
      setTeams(teams.map(team => team.id === updatedEquipe.id ? updatedEquipe : team));
      setEditingTeam(updatedEquipe); // Atualizar a equipe sendo editada na modal

      toast({
        title: "Membro Removido",
        description: "Usuário removido da equipe com sucesso.",
      });

    } catch (error) {
      console.error('Erro ao remover membro da equipe:', error);
      toast({
        title: "Erro",
        description: `Não foi possível remover o membro. Detalhes: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  const saveTeam = async () => {
    console.log('[%s] [saveTeam] Valor do nome da equipe antes da validação:', new Date().toISOString(), formData.nome);
    if (!formData.nome) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, preencha o nome da equipe.",
        variant: "destructive",
      });
      return;
    }

    try {
      let teamToSave: any = {
        nome: formData.nome,
        responsavel: formData.leader,
        maxmembros: formData.members,
        integrantes: formData.leader ? [formData.leader] : [],
      };

      let savedTeam: Equipe;

      if (editingTeam) {
        const updateData: Partial<Equipe> = {
          nome: formData.nome,
          responsavel: formData.leader,
          maxmembros: formData.members,
        };

        // Lógica existente para atualizar integrantes baseada na mudança de responsável
        if (formData.leader && (!editingTeam.integrantes || !editingTeam.integrantes.includes(formData.leader))) {
          const integrantesSemAntigoResponsavel = (editingTeam.integrantes || []).filter(id => id !== editingTeam.responsavel);
          updateData.integrantes = [formData.leader, ...integrantesSemAntigoResponsavel];
        } else if (formData.leader && editingTeam.responsavel === formData.leader) {
           if (!editingTeam.integrantes || !editingTeam.integrantes.includes(formData.leader)) {
                updateData.integrantes = [formData.leader, ...(editingTeam.integrantes || [])];
           }
        } else if (!formData.leader && editingTeam.responsavel) {
           updateData.integrantes = (editingTeam.integrantes || []).filter(id => id !== editingTeam.responsavel);
        }

        console.log('[%s] [saveTeam - Frontend] Enviando dados para atualização (maxmembros): %d', new Date().toISOString(), updateData.maxmembros);

        savedTeam = (await axios.put(`http://localhost:3001/api/equipes/${editingTeam.id}`, updateData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        })).data;

        // Atualizar a equipe na lista e no estado de edição com os dados retornados
        setTeams(teams.map(team => team.id === savedTeam.id ? savedTeam : team));
        setEditingTeam(savedTeam);

        toast({
          title: "Equipe Atualizada",
          description: `A equipe "${savedTeam.nome}" foi atualizada com sucesso.`,
        });

        // Lógica para associar evento existente
        if (formData.eventoId) {
          try {
            if(savedTeam.id) { // Garantir que a equipe foi salva/atualizada antes de associar evento
              // Verificar se o evento já está associado (opcional, mas evita logs/toasts duplicados)
              const isEventAlreadyAssociated = savedTeam.eventos?.includes(formData.eventoId);
              if (!isEventAlreadyAssociated) {
                  await axios.post(`http://localhost:3001/api/equipes/${savedTeam.id}/eventos/${formData.eventoId}`, {}, {
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                  });
                  toast({
                    title: "Associação de Evento",
                    description: `Equipe "${savedTeam.nome}" associada ao evento com sucesso.`,
                  });
              } else {
                   toast({
                    title: "Associação de Evento",
                    description: `Evento já associado à equipe "${savedTeam.nome}".`,
                  });
              }
            }
          } catch (assocError) {
            console.error('Erro ao associar evento à equipe durante edição:', assocError);
            toast({
              title: "Erro de Associação",
              description: `Não foi possível associar o evento à equipe "${savedTeam.nome}". Detalhes: ${(assocError as Error).message}`,
              variant: "destructive",
            });
          }
        }
      } else { // Lógica para criar equipe
        console.log('[%s] [saveTeam - Frontend] Enviando dados para criação (maxmembros): %d', new Date().toISOString(), teamToSave.maxmembros);
        savedTeam = (await axios.post('http://localhost:3001/api/equipes', teamToSave, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        })).data;

         // Adicionar a nova equipe à lista e definir como equipe de edição
        setTeams([...teams, savedTeam]);
        setEditingTeam(savedTeam); // Definir como equipe de edição para permitir adicionar membros logo após criar

        toast({
          title: "Equipe Criada",
          description: `A equipe "${savedTeam.nome}" foi criada com sucesso.`,
        });

        // Lógica para associar evento após a criação
        if (formData.eventoId && savedTeam.id) {
          try {
            await axios.post(`http://localhost:3001/api/equipes/${savedTeam.id}/eventos/${formData.eventoId}`, {}, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
              }
            });
            toast({
              title: "Associação de Evento",
              description: `Equipe "${savedTeam.nome}" associada ao evento com sucesso.`,
            });
          } catch (assocError) {
            console.error('Erro ao associar evento à equipe durante criação:', assocError);
            toast({
              title: "Erro de Associação",
              description: `Não foi possível associar o evento à equipe "${savedTeam.nome}". Detalhes: ${(assocError as Error).message}`,
              variant: "destructive",
            });
          }
        }
      }

      closeModal();
      fetchEquipes(); // Garantir que a lista seja atualizada do backend

    } catch (error) {
      console.error('Erro ao salvar equipe:', error);
      // Verificar se o erro é do backend indicando limite excedido na criação
       if (axios.isAxiosError(error) && error.response?.status === 400 && error.response.data?.message?.includes('limite máximo')) {
           toast({
              title: "Erro de Criação",
              description: error.response.data.message,
              variant: "destructive",
           });
      } else {
        toast({
          title: "Erro",
          description: `Não foi possível salvar a equipe. Detalhes: ${(error as Error).message}`,
          variant: "destructive",
        });
      }
    }
  };

  const deleteTeam = async (teamId: string) => {
    if (confirm("Tem certeza que deseja excluir esta equipe?")) {
      try {
        await axios.delete(`http://localhost:3001/api/equipes/${teamId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        toast({
          title: "Equipe Excluída",
          description: "A equipe foi excluída com sucesso.",
        });
      setTeams(teams.filter(team => team.id !== teamId));
      } catch (error) {
        console.error('Erro ao excluir equipe:', error);
        toast({
          title: "Erro",
          description: `Não foi possível excluir a equipe. Detalhes: ${(error as Error).message}`,
          variant: "destructive",
        });
      }
    }
  };

  const toggleStatus = (teamId: string, newStatus: string) => {
    setTeams(
      teams.map(team => 
        team.id === teamId ? { ...team, status: newStatus } : team
      ) as Equipe[]
    );
  };

  const openDetailsModal = (team: Equipe) => {
    setTeamDetails(team);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setTeamDetails(null);
    setIsDetailsModalOpen(false);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Gerenciamento de Equipes</h2>
              <p className="text-gray-500 mt-1">Gerencie as equipes para diferentes eventos</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button onClick={openCreateModal} className="w-full sm:w-auto" disabled={eventsLoading || eventsError !== null}>
                <Plus className="mr-2 h-4 w-4" /> Nova Equipe
              </Button>
            </div>
          </div>
          
          {eventsLoading && <p>Carregando eventos disponíveis...</p>}
          {eventsError && <p style={{ color: 'red' }}>{eventsError}</p>}
          {!eventsLoading && events.length === 0 && <p>Nenhum evento disponível para associar a equipes.</p>}
          
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              {loading && (
                <div className="text-center py-8 text-gray-500">Carregando equipes...</div>
              )}
              {error && (
                <div className="text-center py-8 text-red-500">{error}</div>
              )}
              {!loading && !error && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipe</TableHead>
                      <TableHead>Evento Associado</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Membros</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {teams.length > 0 ? (
                      teams.map(team => {
                        const associatedEvent = events.find(event => team.eventos?.includes(event.id));
                        const eventName = associatedEvent ? associatedEvent.nome : 'Nenhum evento associado';
                        const numberOfIntegrantes = team.integrantes ? team.integrantes.length : 0;
                        // Encontrar o usuário responsável pelo ID
                        const responsibleUser = users.find(user => user.id === team.responsavel);
                        const responsibleName = responsibleUser ? responsibleUser.nome : 'N/A';

                        return (
                      <TableRow key={team.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{team.nome}</TableCell>
                            <TableCell>{eventName}</TableCell>
                            <TableCell>{responsibleName}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-gray-500" />
                                <span>{numberOfIntegrantes}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEditModal(team)}>
                              <span className="sr-only">Editar</span>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500" onClick={() => deleteTeam(team.id)}>
                              <span className="sr-only">Excluir</span>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                                {/* Botão de Detalhes */}
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openDetailsModal(team)}>
                                  <span className="sr-only">Detalhes</span>
                                  <Users className="h-4 w-4" /> {/* Ícone temporário, pode ser alterado */}
                              </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                        );
                      })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        Nenhuma equipe encontrada com os filtros atuais.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
              <CardTitle>{editingTeam ? 'Editar Equipe' : 'Nova Equipe'}</CardTitle>
              <CardDescription>
                {editingTeam 
                  ? 'Atualize os detalhes da equipe selecionada' 
                  : 'Preencha os detalhes para criar uma nova equipe'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Equipe</Label>
                <Input 
                  id="nome" 
                  name="nome" 
                  placeholder="Nome da equipe" 
                  value={formData.nome} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eventoId">Evento</Label>
                {eventsLoading ? (
                  <p>Carregando eventos...</p>
                ) : eventsError ? (
                  <p style={{ color: 'red' }}>Erro ao carregar eventos.</p>
                ) : events.length === 0 ? (
                  <p>Nenhum evento disponível.</p>
                ) : (
                <select 
                  id="eventoId"
                  name="eventoId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={formData.eventoId}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione um evento</option>
                  {events
                    .filter(event => event.status === 'Programado' || event.status === 'Em Andamento')
                    .map(event => (
                    <option key={event.id} value={event.id}>{event.nome}</option>
                  ))}
                </select>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="leader">Responsável</Label>
                {usersLoading ? (
                  <p>Carregando usuários...</p>
                ) : usersError ? (
                  <p style={{ color: 'red' }}>Erro ao carregar usuários.</p>
                ) : users.length === 0 ? (
                  <p>Nenhum usuário disponível.</p>
                ) : (
                <select
                  id="leader" 
                  name="leader" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={formData.leader} 
                  onChange={handleInputChange} 
                >
                  <option value="">Selecione um responsável</option>
                  {availableUsers.map(user => (
                    <option key={user.id} value={user.id}>{user.nome}</option>
                  ))}
                </select>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="members">Número de Membros</Label>
                <Input 
                  id="members" 
                  name="members" 
                  type="number" 
                  min="0" 
                  placeholder="0" 
                  value={formData.members} 
                  onChange={handleInputChange} 
                />
              </div>
              
              {/* Seção para gerenciar membros da equipe (apenas em modo de edição) */}
              {editingTeam && (
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="current-members">Membros Atuais ({editingTeam.integrantes?.length || 0})</Label>
                    {/* Lista de membros atuais */}
                    <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                      {editingTeam.integrantes && editingTeam.integrantes.length > 0 ? (
                        editingTeam.integrantes.map(memberId => {
                          // Encontrar o usuário pelo ID
                          const member = users.find(user => user.id === memberId);
                          return (member ? (
                            <div key={memberId} className="flex items-center justify-between py-1 border-b last:border-b-0">
                              <span>{member.nome}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500 hover:bg-red-50"
                                onClick={() => handleRemoveMember(memberId)}
                              >
                                <X className="h-4 w-4" />
                                Remover
                              </Button>
                            </div>
                          ) : (
                            <div key={memberId} className="text-gray-500">ID de membro desconhecido: {memberId}</div>
                          ));
                        })
                      ) : (
                        <div className="text-gray-500">Nenhum membro nesta equipe.</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Adicionar novo membro */}
                  <div className="grid gap-2">
                    <Label htmlFor="add-member-search">Adicionar Membro (Buscar)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="add-member-search"
                        type="text"
                        placeholder="Buscar usuário por nome ou email..."
                        value={memberSearchQuery}
                        onChange={(e) => setMemberSearchQuery(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleAddMember} 
                        disabled={
                          !userToAddId || 
                          (editingTeam?.integrantes || []).includes(userToAddId) || 
                          (editingTeam?.maxmembros > 0 && (editingTeam?.integrantes?.length || 0) >= editingTeam.maxmembros)
                        }
                      >
                        Adicionar
                      </Button>
                    </div>
                     {/* Lista de resultados da busca */}
                     {memberSearchQuery.trim() !== '' && filteredUsersForAdd.length > 0 && (
                        <div className="border rounded-md max-h-32 overflow-y-auto">
                           {filteredUsersForAdd.map(user => (
                              <div 
                                 key={user.id} 
                                 className={`flex items-center justify-between py-1 px-2 cursor-pointer hover:bg-gray-100 ${
                                    (editingTeam?.maxmembros > 0 && (editingTeam?.integrantes?.length || 0) >= editingTeam.maxmembros) ? 'opacity-50 cursor-not-allowed' : ''
                                 }`}
                                 onClick={() => {
                                    const maxMembers = editingTeam?.maxmembros || 0;
                                    if (maxMembers === 0 || (editingTeam?.integrantes?.length || 0) < maxMembers) {
                                       setUserToAddId(user.id);
                                    } else {
                                       toast({
                                          title: "Limite de Membros",
                                          description: `Esta equipe já atingiu o limite máximo de ${maxMembers} membros.`,
                                          variant: "destructive",
                                       });
                                    }
                                 }}
                              >
                                 <span>{user.nome}</span>
                                 {userToAddId === user.id && <Check className="h-4 w-4 text-green-500" />}
                              </div>
                           ))}
                        </div>
                     )}
                      {memberSearchQuery.trim() !== '' && filteredUsersForAdd.length === 0 && (
                        <div className="text-sm text-gray-500 px-2">Nenhum usuário encontrado.</div>
                      )}

                    {/* Mostrar mensagem de limite atingido */}
                    {editingTeam?.maxmembros > 0 && (editingTeam?.integrantes?.length || 0) >= editingTeam.maxmembros && (
                        <div className="text-sm text-red-500 px-2">
                           Limite máximo de {editingTeam.maxmembros} membros atingido.
                        </div>
                    )}

                    {/* Campo oculto para o valor selecionado */}
                    <input type="hidden" value={userToAddId} />

                  </div>
              </div>
              )}

            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={closeModal}>Cancelar</Button>
              <Button onClick={saveTeam} disabled={eventsLoading || eventsError !== null || usersLoading || usersError !== null}>Salvar</Button> {/* Desabilitar se usuários estiverem carregando ou com erro */}
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Modal de Detalhes da Equipe */}
      {isDetailsModalOpen && teamDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
              <CardTitle>Detalhes da Equipe</CardTitle>
              <CardDescription>Informações detalhadas da equipe.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Nome da Equipe: {teamDetails.nome}</h3>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Responsável: 
                  {users.find(user => user.id === teamDetails.responsavel)?.nome || 'N/A'}
                </h3>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Limite de Membros: {teamDetails.maxmembros !== undefined ? teamDetails.maxmembros : 'Ilimitado'}</h3>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Membros ({teamDetails.integrantes?.length || 0}):</h3>
                {teamDetails.integrantes && teamDetails.integrantes.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {teamDetails.integrantes.map(memberId => {
                      const member = users.find(user => user.id === memberId);
                      return member ? <li key={memberId}>{member.nome}</li> : null;
                    })}
                  </ul>
                ) : (
                  <p>Nenhum membro nesta equipe.</p>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold">Eventos Associados:</h3>
                {teamDetails.eventos && teamDetails.eventos.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {teamDetails.eventos.map(eventId => {
                      const event = events.find(event => event.id === eventId);
                      return event ? <li key={eventId}>{event.nome}</li> : null;
                    })}
                  </ul>
                ) : (
                  <p>Nenhum evento associado a esta equipe.</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" onClick={closeDetailsModal}>Fechar</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </Layout>
  );
};

export default Equipes;
