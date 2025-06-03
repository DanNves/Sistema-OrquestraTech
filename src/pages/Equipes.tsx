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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [usersLoading, setUsersLoading] = useState(true); // Estado para loading de usuários
  const [usersError, setUsersError] = useState<string | null>(null); // Estado para erro de usuários

  useEffect(() => {
    const fetchEquipes = async () => {
      try {
        const response = await axios.get<Equipe[]>('http://localhost:3001/api/equipes');
        setTeams(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar equipes:', err);
        setError('Não foi possível carregar as equipes.');
        setLoading(false);
      }
    };

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
  }, []);

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
    setFormData({
      ...formData,
      [name as 'nome' | 'eventoId' | 'leader' | 'members']: name === 'members' ? parseInt(value) || 0 : value
    });
  };

  const openCreateModal = () => {
    setEditingTeam(null);
    setFormData({
      nome: '',
      eventoId: '',
      leader: '',
      members: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (team: Equipe) => {
    setEditingTeam(team);
    setFormData({
      nome: team.nome,
      eventoId: team.eventos && team.eventos.length > 0 ? team.eventos[0] : '',
      leader: team.responsavel || '',
      members: team.integrantes ? team.integrantes.length : 0,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const saveTeam = async () => {
    console.log('Valor do nome da equipe antes da validação:', formData.nome);
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
      };

      let savedTeam: Equipe;

      if (editingTeam) {
        const updateData: Partial<Equipe> = {
          nome: formData.nome,
          responsavel: formData.leader,
        };

        savedTeam = (await axios.put(`http://localhost:3001/api/equipes/${editingTeam.id}`, updateData)).data;
        toast({
          title: "Equipe Atualizada",
          description: `A equipe "${savedTeam.nome}" foi atualizada com sucesso.`,
        });

        if (formData.eventoId) {
          try {
            if(editingTeam.eventos && editingTeam.eventos.length > 0) {
                const isEventAlreadyAssociated = editingTeam.eventos.includes(formData.eventoId);

                if (!isEventAlreadyAssociated) {
                    await axios.post(`http://localhost:3001/api/equipes/${editingTeam.id}/eventos/${formData.eventoId}`);
                     toast({
                        title: "Associação de Evento",
                        description: `Equipe "${savedTeam.nome}" associada ao novo evento com sucesso.`,
                    });
                } else {
                     toast({
                        title: "Associação de Evento",
                        description: `Evento já associado à equipe "${savedTeam.nome}".`,
                    });
                }
            } else {
                 await axios.post(`http://localhost:3001/api/equipes/${editingTeam.id}/eventos/${formData.eventoId}`);
                  toast({
                     title: "Associação de Evento",
                     description: `Equipe "${savedTeam.nome}" associada ao evento com sucesso.`,
                 });
            }
        } catch (assocError) {
            console.error('Erro ao associar evento à equipe durante edição:', assocError);
            toast({
                title: "Erro de Associação",
                description: `Não foi possível associar/atualizar o evento da equipe "${savedTeam.nome}". Detalhes: ${(assocError as Error).message}`,
                variant: "destructive",
            });
        }

        } else if (editingTeam.eventos && editingTeam.eventos.length > 0) {
             console.warn('Nenhuma lógica implementada para desassociar eventos via este modal.');
             toast({
                 title: "Aviso",
                 description: "A desassociação de eventos não está implementada via este formulário de edição.",
                 variant: "default",
             });
        }

      } else {
        savedTeam = (await axios.post('http://localhost:3001/api/equipes', teamToSave)).data;
        toast({
          title: "Equipe Criada",
          description: `A equipe "${savedTeam.nome}" foi criada com sucesso.`,
        });

        if (formData.eventoId && savedTeam.id) {
          try {
            await axios.post(`http://localhost:3001/api/equipes/${savedTeam.id}/eventos/${formData.eventoId}`);
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
      const response = await axios.get<Equipe[]>('http://localhost:3001/api/equipes');
      setTeams(response.data);

    } catch (error) {
      console.error('Erro ao salvar equipe:', error);
      toast({
        title: "Erro",
        description: `Não foi possível salvar a equipe. Detalhes: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  const deleteTeam = async (teamId: string) => {
    if (confirm("Tem certeza que deseja excluir esta equipe?")) {
      try {
        await axios.delete(`http://localhost:3001/api/equipes/${teamId}`);
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
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.length > 0 ? (
                      teams.map(team => {
                        const associatedEvent = events.find(event => team.eventos?.includes(event.id));
                        const eventName = associatedEvent ? associatedEvent.nome : 'Nenhum evento associado';
                        const numberOfIntegrantes = team.integrantes ? team.integrantes.length : 0;
                        return (
                          <TableRow key={team.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{team.nome}</TableCell>
                            <TableCell>{eventName}</TableCell>
                            <TableCell>{team.responsavel || 'N/A'}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1 text-gray-500" />
                                <span>{numberOfIntegrantes}</span>
                              </div>
                            </TableCell>
                            <TableCell>{/* Status - Não existe no modelo backend de Equipe */ 'N/A'}</TableCell>
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
          <Card className="w-full max-w-md mx-auto">
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
                  {users.map(user => (
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
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={closeModal}>Cancelar</Button>
              <Button onClick={saveTeam} disabled={eventsLoading || eventsError !== null || usersLoading || usersError !== null}>Salvar</Button> {/* Desabilitar se usuários estiverem carregando ou com erro */}
            </CardFooter>
          </Card>
        </div>
      )}
    </Layout>
  );
};

export default Equipes;
