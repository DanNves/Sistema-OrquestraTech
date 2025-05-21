
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Edit, Trash2, Check, X, Users, MapPin, User } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data for events
const mockEvents = [
  {
    id: 1,
    name: 'Workshop de Mixagem',
    date: '15/06/2025',
    location: 'Estúdio Central',
    responsiblePerson: 'João Silva',
    teams: ['Equipe de Áudio', 'Equipe de Produção'],
    maxParticipants: 20,
    currentParticipants: 15,
    status: 'active',
    description: 'Workshop técnico sobre mixagem de áudio para instrumentos e voz'
  },
  {
    id: 2,
    name: 'Curso de Produção Musical',
    date: '22/06/2025',
    location: 'Sala de Treinamento 3',
    responsiblePerson: 'Maria Santos',
    teams: ['Equipe de Produção'],
    maxParticipants: 15,
    currentParticipants: 12,
    status: 'active',
    description: 'Curso introdutório sobre produção musical em estúdio'
  },
  {
    id: 3, 
    name: 'Encontro Técnico',
    date: '05/07/2025',
    location: 'Auditório Principal',
    responsiblePerson: 'Carlos Mendes',
    teams: ['Equipe Técnica', 'Equipe de Áudio'],
    maxParticipants: 30,
    currentParticipants: 8,
    status: 'pending',
    description: 'Encontro para alinhamento técnico e treinamento da equipe'
  },
  {
    id: 4,
    name: 'Festival de Música',
    date: '18/07/2025',
    location: 'Praça Central',
    responsiblePerson: 'Ana Oliveira',
    teams: ['Equipe de Sonorização', 'Equipe de Iluminação'],
    maxParticipants: 0,
    currentParticipants: 0,
    status: 'pending',
    description: 'Festival de música ao ar livre para comunidade'
  },
  {
    id: 5,
    name: 'Show ao Vivo',
    date: '10/08/2025',
    location: 'Teatro Municipal',
    responsiblePerson: 'Ricardo Souza',
    teams: ['Equipe de Iluminação'],
    maxParticipants: 200,
    currentParticipants: 0,
    status: 'inactive',
    description: 'Apresentação musical com artistas locais'
  }
];

// Mock data for teams (for dropdown)
const mockTeams = [
  { id: 1, name: 'Equipe de Áudio' },
  { id: 2, name: 'Equipe de Produção' },
  { id: 3, name: 'Equipe Técnica' },
  { id: 4, name: 'Equipe de Sonorização' },
  { id: 5, name: 'Equipe de Iluminação' }
];

// Mock data for responsible persons
const mockResponsiblePersons = [
  { id: 1, name: 'João Silva' },
  { id: 2, name: 'Maria Santos' },
  { id: 3, name: 'Carlos Mendes' },
  { id: 4, name: 'Ana Oliveira' },
  { id: 5, name: 'Ricardo Souza' },
  { id: 6, name: 'Paula Costa' },
  { id: 7, name: 'Marcos Rocha' }
];

const Eventos = () => {
  const [events, setEvents] = useState(mockEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    responsiblePerson: '',
    teams: [],
    maxParticipants: 0,
    currentParticipants: 0,
    status: 'pending',
    description: ''
  });
  const [filter, setFilter] = useState('all');

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['maxParticipants', 'currentParticipants'].includes(name) ? parseInt(value) || 0 : value
    });
  };

  // Handle select for responsible person
  const handleResponsiblePersonChange = (value) => {
    setFormData({
      ...formData,
      responsiblePerson: value
    });
  };

  // Handle team selection (multiple)
  const handleTeamChange = (teamName) => {
    setFormData(prev => {
      const updatedTeams = prev.teams.includes(teamName)
        ? prev.teams.filter(t => t !== teamName)
        : [...prev.teams, teamName];
      
      return { ...prev, teams: updatedTeams };
    });
  };

  // Open modal for creating a new event
  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData({
      name: '',
      date: '',
      location: '',
      responsiblePerson: '',
      teams: [],
      maxParticipants: 0,
      currentParticipants: 0,
      status: 'pending',
      description: ''
    });
    setIsModalOpen(true);
  };

  // Open modal for editing an event
  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      date: event.date,
      location: event.location,
      responsiblePerson: event.responsiblePerson,
      teams: event.teams || [],
      maxParticipants: event.maxParticipants,
      currentParticipants: event.currentParticipants,
      status: event.status,
      description: event.description
    });
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Save event (create or update)
  const saveEvent = () => {
    if (editingEvent) {
      // Update existing event
      setEvents(
        events.map(event => 
          event.id === editingEvent.id ? { ...event, ...formData } : event
        )
      );
    } else {
      // Create new event
      const newEvent = {
        id: Date.now(), // Simple way to generate a unique ID
        ...formData
      };
      setEvents([...events, newEvent]);
    }
    closeModal();
  };

  // Delete an event
  const deleteEvent = (eventId) => {
    if (confirm("Tem certeza que deseja excluir este evento?")) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  // Change event status
  const toggleStatus = (eventId, newStatus) => {
    setEvents(
      events.map(event => 
        event.id === eventId ? { ...event, status: newStatus } : event
      )
    );
  };

  // Filter events based on status
  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.status === filter);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          {/* Header with filters and actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Gerenciamento de Eventos</h2>
              <p className="text-gray-400 mt-1">Gerencie os eventos técnicos musicais</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className={filter === 'all' ? 'bg-[#1a223f] text-white border-[#1f2b45]' : 'bg-transparent text-gray-400 border-[#1f2b45]'}
                  onClick={() => setFilter('all')}
                >
                  Todos
                </Button>
                <Button 
                  variant="outline" 
                  className={filter === 'active' ? 'bg-[#1a3d1a] text-green-400 border-green-800' : 'bg-transparent text-gray-400 border-[#1f2b45]'}
                  onClick={() => setFilter('active')}
                >
                  Ativos
                </Button>
                <Button 
                  variant="outline" 
                  className={filter === 'pending' ? 'bg-[#3f3415] text-yellow-400 border-yellow-800' : 'bg-transparent text-gray-400 border-[#1f2b45]'}
                  onClick={() => setFilter('pending')}
                >
                  Pendentes
                </Button>
              </div>
              <Button onClick={openCreateModal} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" /> Novo Evento
              </Button>
            </div>
          </div>
          
          {/* Events Table */}
          <div className="bg-[#131b2e] border border-[#1f2b45] shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#1a223f]">
                  <TableRow className="border-b border-[#1f2b45]">
                    <TableHead className="text-gray-400">Evento</TableHead>
                    <TableHead className="text-gray-400">Data</TableHead>
                    <TableHead className="text-gray-400">Local</TableHead>
                    <TableHead className="text-gray-400">Responsável</TableHead>
                    <TableHead className="text-center text-gray-400">Equipes</TableHead>
                    <TableHead className="text-gray-400">Participantes</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-right text-gray-400">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                      <TableRow key={event.id} className="hover:bg-[#1a223f] border-b border-[#1f2b45]">
                        <TableCell>
                          <div>
                            <div className="font-medium text-white">{event.name}</div>
                            <div className="text-xs text-gray-400 mt-1">{event.description}</div>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                            <span className="text-gray-300">{event.date}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-blue-400" />
                            <span className="text-gray-300">{event.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-blue-400" />
                            <span className="text-gray-300">{event.responsiblePerson}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge 
                            variant="secondary" 
                            className="flex items-center justify-center gap-1 bg-[#1a223f] text-blue-400 border border-blue-800"
                          >
                            <Users className="h-3 w-3" />
                            {event.teams ? event.teams.length : 0}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-gray-400" />
                            <span className="text-gray-300">
                              {event.currentParticipants} 
                              {event.maxParticipants > 0 ? ` / ${event.maxParticipants}` : ''}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {event.status === 'active' && (
                            <Badge className="bg-green-900/20 text-green-400 border border-green-800">
                              Ativo
                            </Badge>
                          )}
                          {event.status === 'pending' && (
                            <Badge className="bg-yellow-900/20 text-yellow-400 border border-yellow-800">
                              Pendente
                            </Badge>
                          )}
                          {event.status === 'inactive' && (
                            <Badge className="bg-gray-900/20 text-gray-400 border border-gray-700">
                              Inativo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:bg-[#1a223f] hover:text-gray-200">
                                <span className="sr-only">Abrir menu</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="1" />
                                  <circle cx="12" cy="5" r="1" />
                                  <circle cx="12" cy="19" r="1" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#131b2e] border border-[#1f2b45] text-white w-[160px]">
                              <DropdownMenuItem onClick={() => openEditModal(event)} className="cursor-pointer hover:bg-[#1a223f]">
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Editar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => deleteEvent(event.id)} className="cursor-pointer text-red-400 hover:bg-[#1a223f]">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Excluir</span>
                              </DropdownMenuItem>
                              {event.status !== 'active' && (
                                <DropdownMenuItem onClick={() => toggleStatus(event.id, 'active')} className="cursor-pointer text-green-400 hover:bg-[#1a223f]">
                                  <Check className="mr-2 h-4 w-4" />
                                  <span>Ativar</span>
                                </DropdownMenuItem>
                              )}
                              {event.status === 'active' && (
                                <DropdownMenuItem onClick={() => toggleStatus(event.id, 'inactive')} className="cursor-pointer text-gray-400 hover:bg-[#1a223f]">
                                  <X className="mr-2 h-4 w-4" />
                                  <span>Desativar</span>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-400">
                        Nenhum evento encontrado com os filtros atuais.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for creating/editing event */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md mx-auto bg-[#131b2e] border border-[#1f2b45] text-white">
            <CardHeader className="border-b border-[#1f2b45]">
              <CardTitle>{editingEvent ? 'Editar Evento' : 'Novo Evento'}</CardTitle>
              <CardDescription className="text-gray-400">
                {editingEvent 
                  ? 'Atualize os detalhes do evento selecionado' 
                  : 'Preencha os detalhes para criar um novo evento'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Nome do Evento</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Nome do evento" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  className="bg-[#1a223f] border-[#1f2b45] text-white"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-gray-300">Data</Label>
                  <Input 
                    id="date" 
                    name="date" 
                    placeholder="DD/MM/AAAA" 
                    value={formData.date} 
                    onChange={handleInputChange} 
                    className="bg-[#1a223f] border-[#1f2b45] text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-300">Local</Label>
                  <Input 
                    id="location" 
                    name="location" 
                    placeholder="Local do evento" 
                    value={formData.location} 
                    onChange={handleInputChange} 
                    className="bg-[#1a223f] border-[#1f2b45] text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="responsiblePerson" className="text-gray-300">Pessoa Responsável</Label>
                <Select 
                  value={formData.responsiblePerson} 
                  onValueChange={handleResponsiblePersonChange}
                >
                  <SelectTrigger className="bg-[#1a223f] border-[#1f2b45] text-gray-300">
                    <SelectValue placeholder="Selecione o responsável" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#131b2e] border-[#1f2b45] text-white">
                    {mockResponsiblePersons.map(person => (
                      <SelectItem key={person.id} value={person.name}>
                        {person.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-300">Equipes Participantes</Label>
                <div className="border border-[#1f2b45] bg-[#1a223f] rounded-md p-3 space-y-2">
                  {mockTeams.map(team => (
                    <div key={team.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`team-${team.id}`}
                        checked={formData.teams.includes(team.name)}
                        onCheckedChange={() => handleTeamChange(team.name)}
                        className="border-[#1f2b45] data-[state=checked]:bg-blue-600"
                      />
                      <label 
                        htmlFor={`team-${team.id}`}
                        className="text-sm font-medium leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {team.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants" className="text-gray-300">Máximo de Participantes</Label>
                  <Input 
                    id="maxParticipants" 
                    name="maxParticipants" 
                    type="number" 
                    min="0" 
                    placeholder="0" 
                    value={formData.maxParticipants} 
                    onChange={handleInputChange} 
                    className="bg-[#1a223f] border-[#1f2b45] text-white"
                  />
                  <p className="text-xs text-gray-400">0 = Ilimitado</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currentParticipants" className="text-gray-300">Participantes Atuais</Label>
                  <Input 
                    id="currentParticipants" 
                    name="currentParticipants" 
                    type="number" 
                    min="0" 
                    placeholder="0" 
                    value={formData.currentParticipants} 
                    onChange={handleInputChange} 
                    className="bg-[#1a223f] border-[#1f2b45] text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status" className="text-gray-300">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({...formData, status: value})}
                >
                  <SelectTrigger className="bg-[#1a223f] border-[#1f2b45] text-gray-300">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#131b2e] border-[#1f2b45] text-white">
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">Descrição</Label>
                <textarea 
                  id="description" 
                  name="description" 
                  rows={3}
                  className="flex w-full rounded-md border border-[#1f2b45] bg-[#1a223f] px-3 py-2 text-sm text-white ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Descreva o evento" 
                  value={formData.description} 
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-[#1f2b45] pt-4">
              <Button variant="outline" onClick={closeModal} className="border-[#1f2b45] hover:bg-[#1a223f] text-gray-300">
                Cancelar
              </Button>
              <Button onClick={saveEvent} className="bg-blue-600 hover:bg-blue-700 text-white">
                Salvar
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </Layout>
  );
};

export default Eventos;
