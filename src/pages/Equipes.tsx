
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Users, Plus, Edit, Trash2, Check, X } from 'lucide-react';

// Mock data for teams
const mockTeams = [
  {
    id: 1,
    name: 'Equipe de Áudio',
    event: 'Workshop de Mixagem',
    members: 6,
    status: 'active',
    leader: 'Carlos Silva'
  },
  {
    id: 2,
    name: 'Equipe de Produção',
    event: 'Curso de Produção Musical',
    members: 4,
    status: 'active',
    leader: 'Ana Santos'
  },
  {
    id: 3, 
    name: 'Equipe Técnica',
    event: 'Encontro Técnico',
    members: 5,
    status: 'active',
    leader: 'Roberto Oliveira'
  },
  {
    id: 4,
    name: 'Equipe de Sonorização',
    event: 'Festival de Música',
    members: 8,
    status: 'pending',
    leader: 'Mariana Costa'
  },
  {
    id: 5,
    name: 'Equipe de Iluminação',
    event: 'Show ao Vivo',
    members: 3,
    status: 'inactive',
    leader: 'Paulo Mendes'
  }
];

// Mock data for events (for dropdown)
const mockEvents = [
  { id: 1, name: 'Workshop de Mixagem' },
  { id: 2, name: 'Curso de Produção Musical' },
  { id: 3, name: 'Encontro Técnico' },
  { id: 4, name: 'Festival de Música' },
  { id: 5, name: 'Show ao Vivo' },
  { id: 6, name: 'Masterclass de Guitarra' }
];

const Equipes = () => {
  const [teams, setTeams] = useState(mockTeams);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    event: '',
    leader: '',
    members: 0,
    status: 'active'
  });
  const [filter, setFilter] = useState('all');

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'members' ? parseInt(value) || 0 : value
    });
  };

  // Open modal for creating a new team
  const openCreateModal = () => {
    setEditingTeam(null);
    setFormData({
      name: '',
      event: '',
      leader: '',
      members: 0,
      status: 'active'
    });
    setIsModalOpen(true);
  };

  // Open modal for editing a team
  const openEditModal = (team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      event: team.event,
      leader: team.leader,
      members: team.members,
      status: team.status
    });
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Save team (create or update)
  const saveTeam = () => {
    if (editingTeam) {
      // Update existing team
      setTeams(
        teams.map(team => 
          team.id === editingTeam.id ? { ...team, ...formData } : team
        )
      );
    } else {
      // Create new team
      const newTeam = {
        id: Date.now(), // Simple way to generate a unique ID
        ...formData
      };
      setTeams([...teams, newTeam]);
    }
    closeModal();
  };

  // Delete a team
  const deleteTeam = (teamId) => {
    if (confirm("Tem certeza que deseja excluir esta equipe?")) {
      setTeams(teams.filter(team => team.id !== teamId));
    }
  };

  // Change team status
  const toggleStatus = (teamId, newStatus) => {
    setTeams(
      teams.map(team => 
        team.id === teamId ? { ...team, status: newStatus } : team
      )
    );
  };

  // Filter teams based on status
  const filteredTeams = filter === 'all' 
    ? teams 
    : teams.filter(team => team.status === filter);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          {/* Header with filters and actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Gerenciamento de Equipes</h2>
              <p className="text-gray-500 mt-1">Gerencie as equipes para diferentes eventos</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className={filter === 'all' ? 'bg-primary-50 text-primary-600' : ''}
                  onClick={() => setFilter('all')}
                >
                  Todas
                </Button>
                <Button 
                  variant="outline" 
                  className={filter === 'active' ? 'bg-green-50 text-green-600' : ''}
                  onClick={() => setFilter('active')}
                >
                  Ativas
                </Button>
                <Button 
                  variant="outline" 
                  className={filter === 'pending' ? 'bg-yellow-50 text-yellow-600' : ''}
                  onClick={() => setFilter('pending')}
                >
                  Pendentes
                </Button>
              </div>
              <Button onClick={openCreateModal} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Nova Equipe
              </Button>
            </div>
          </div>
          
          {/* Teams Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipe</TableHead>
                    <TableHead>Evento</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Membros</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeams.length > 0 ? (
                    filteredTeams.map(team => (
                      <TableRow key={team.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{team.name}</TableCell>
                        <TableCell>{team.event}</TableCell>
                        <TableCell>{team.leader}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-gray-500" />
                            <span>{team.members}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {team.status === 'active' && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              Ativa
                            </span>
                          )}
                          {team.status === 'pending' && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                              Pendente
                            </span>
                          )}
                          {team.status === 'inactive' && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                              Inativa
                            </span>
                          )}
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
                            {team.status !== 'active' && (
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-green-500" onClick={() => toggleStatus(team.id, 'active')}>
                                <span className="sr-only">Ativar</span>
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            {team.status === 'active' && (
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500" onClick={() => toggleStatus(team.id, 'inactive')}>
                                <span className="sr-only">Desativar</span>
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        Nenhuma equipe encontrada com os filtros atuais.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for creating/editing team */}
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
                <Label htmlFor="name">Nome da Equipe</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Nome da equipe" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="event">Evento</Label>
                <select 
                  id="event" 
                  name="event" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={formData.event} 
                  onChange={handleInputChange}
                >
                  <option value="">Selecione um evento</option>
                  {mockEvents.map(event => (
                    <option key={event.id} value={event.name}>{event.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="leader">Responsável</Label>
                <Input 
                  id="leader" 
                  name="leader" 
                  placeholder="Nome do responsável" 
                  value={formData.leader} 
                  onChange={handleInputChange} 
                />
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
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select 
                  id="status" 
                  name="status" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={formData.status} 
                  onChange={handleInputChange}
                >
                  <option value="active">Ativa</option>
                  <option value="pending">Pendente</option>
                  <option value="inactive">Inativa</option>
                </select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={closeModal}>Cancelar</Button>
              <Button onClick={saveTeam}>Salvar</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </Layout>
  );
};

export default Equipes;
