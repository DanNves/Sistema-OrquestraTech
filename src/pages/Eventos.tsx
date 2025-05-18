
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Calendar, Plus, Edit, Trash2, Check, X, Users } from 'lucide-react';

// Mock data for events
const mockEvents = [
  {
    id: 1,
    name: 'Workshop de Mixagem',
    date: '15/06/2025',
    location: 'Estúdio Central',
    team: 'Equipe de Áudio',
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
    team: 'Equipe de Produção',
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
    team: 'Equipe Técnica',
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
    team: 'Equipe de Sonorização',
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
    team: 'Equipe de Iluminação',
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

const Eventos = () => {
  const [events, setEvents] = useState(mockEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    team: '',
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

  // Open modal for creating a new event
  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData({
      name: '',
      date: '',
      location: '',
      team: '',
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
      team: event.team,
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
              <h2 className="text-2xl font-bold text-gray-800">Gerenciamento de Eventos</h2>
              <p className="text-gray-500 mt-1">Gerencie os eventos técnicos musicais</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className={filter === 'all' ? 'bg-primary-50 text-primary-600' : ''}
                  onClick={() => setFilter('all')}
                >
                  Todos
                </Button>
                <Button 
                  variant="outline" 
                  className={filter === 'active' ? 'bg-green-50 text-green-600' : ''}
                  onClick={() => setFilter('active')}
                >
                  Ativos
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
                <Plus className="mr-2 h-4 w-4" /> Novo Evento
              </Button>
            </div>
          </div>
          
          {/* Events Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Evento</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Equipe</TableHead>
                    <TableHead>Participantes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                      <TableRow key={event.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="font-medium">{event.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{event.description}</div>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                            <span>{event.date}</span>
                          </div>
                        </TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>{event.team}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-gray-500" />
                            <span>
                              {event.currentParticipants} 
                              {event.maxParticipants > 0 ? ` / ${event.maxParticipants}` : ''}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {event.status === 'active' && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              Ativo
                            </span>
                          )}
                          {event.status === 'pending' && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                              Pendente
                            </span>
                          )}
                          {event.status === 'inactive' && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                              Inativo
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEditModal(event)}>
                              <span className="sr-only">Editar</span>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500" onClick={() => deleteEvent(event.id)}>
                              <span className="sr-only">Excluir</span>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            {event.status !== 'active' && (
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-green-500" onClick={() => toggleStatus(event.id, 'active')}>
                                <span className="sr-only">Ativar</span>
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            {event.status === 'active' && (
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500" onClick={() => toggleStatus(event.id, 'inactive')}>
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
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>{editingEvent ? 'Editar Evento' : 'Novo Evento'}</CardTitle>
              <CardDescription>
                {editingEvent 
                  ? 'Atualize os detalhes do evento selecionado' 
                  : 'Preencha os detalhes para criar um novo evento'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Evento</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Nome do evento" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input 
                    id="date" 
                    name="date" 
                    placeholder="DD/MM/AAAA" 
                    value={formData.date} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Local</Label>
                  <Input 
                    id="location" 
                    name="location" 
                    placeholder="Local do evento" 
                    value={formData.location} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="team">Equipe Responsável</Label>
                <select 
                  id="team" 
                  name="team" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={formData.team} 
                  onChange={handleInputChange}
                >
                  <option value="">Selecione uma equipe</option>
                  {mockTeams.map(team => (
                    <option key={team.id} value={team.name}>{team.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Máximo de Participantes</Label>
                  <Input 
                    id="maxParticipants" 
                    name="maxParticipants" 
                    type="number" 
                    min="0" 
                    placeholder="0" 
                    value={formData.maxParticipants} 
                    onChange={handleInputChange} 
                  />
                  <p className="text-xs text-gray-500">0 = Ilimitado</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currentParticipants">Participantes Atuais</Label>
                  <Input 
                    id="currentParticipants" 
                    name="currentParticipants" 
                    type="number" 
                    min="0" 
                    placeholder="0" 
                    value={formData.currentParticipants} 
                    onChange={handleInputChange} 
                  />
                </div>
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
                  <option value="active">Ativo</option>
                  <option value="pending">Pendente</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <textarea 
                  id="description" 
                  name="description" 
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Descreva o evento" 
                  value={formData.description} 
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={closeModal}>Cancelar</Button>
              <Button onClick={saveEvent}>Salvar</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </Layout>
  );
};

export default Eventos;
