
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { Evento as EventoType } from '../types/models';
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
import { Skeleton } from '@/components/ui/skeleton';


// Mock data for teams (for dropdown) - these could eventually come from an API
const mockTeams = [
  { id: 1, name: 'Equipe de Áudio' },
  { id: 2, name: 'Equipe de Produção' },
  { id: 3, name: 'Equipe Técnica' },
  { id: 4, name: 'Equipe de Sonorização' },
  { id: 5, name: 'Equipe de Iluminação' }
];

// Mock data for responsible persons - these could eventually come from an API
const mockResponsiblePersons = [
  { id: 1, name: 'João Silva' },
  { id: 2, name: 'Maria Santos' },
  { id: 3, name: 'Carlos Mendes' },
  { id: 4, name: 'Ana Oliveira' },
  { id: 5, name: 'Ricardo Souza' },
  { id: 6, name: 'Paula Costa' },
  { id: 7, name: 'Marcos Rocha' }
];


// Function to fetch events
const fetchEventos = async (): Promise<EventoType[]> => {
  const response = await apiClient.get<EventoType[]>('/eventos');
  // Assuming API returns array directly. If it's wrapped, e.g., response.data.data, adjust here.
  return response.data; 
};

// Helper to map backend EventoType to the format expected by the local state/UI
// This mapping is more complex due to the existing UI structure
const mapApiEventoToLocalFormat = (apiEvento: EventoType) => {
  let localStatus = 'pending'; // Default
  if (apiEvento.status === 'Programado') localStatus = 'active'; // Mapping 'Programado' to 'active' for UI
  if (apiEvento.status === 'Concluído') localStatus = 'inactive'; // Mapping 'Concluído' to 'inactive' (or a new 'completed' status if UI supports)
  if (apiEvento.status === 'Cancelado') localStatus = 'inactive'; // Or a specific 'cancelled' status

  return {
    id: apiEvento.id,
    name: apiEvento.titulo, // Map 'titulo' to 'name'
    date: new Date(apiEvento.data).toLocaleDateString('pt-BR') + ` (${apiEvento.horaInicio}-${apiEvento.horaFim})`,
    location: apiEvento.local,
    responsiblePerson: 'API User', // Placeholder - API doesn't provide this directly for Evento
    teams: apiEvento.equipesParticipantes, // Assuming this is an array of strings (team names or IDs)
    maxParticipants: 0, // Placeholder - API Evento doesn't have this
    currentParticipants: apiEvento.participantes.length, // Length of participantes array
    status: localStatus,
    description: apiEvento.descricao,
    // Keep original API data if needed for editing or details
    _originalData: apiEvento 
  };
};


const Eventos = () => {
  const { data: apiEventos, isLoading, error } = useQuery<EventoType[], Error>({
    queryKey: ['eventos'],
    queryFn: fetchEventos,
  });

  const [events, setEvents] = useState<any[]>([]); // Will hold mapped events
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
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

  useEffect(() => {
    if (apiEventos) {
      setEvents(apiEventos.map(mapApiEventoToLocalFormat));
    }
  }, [apiEventos]);

  // Handle input changes in the form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['maxParticipants', 'currentParticipants'].includes(name) ? parseInt(value) || 0 : value
    }));
  };

  // Handle select for responsible person
  const handleResponsiblePersonChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      responsiblePerson: value
    }));
  };

  // Handle team selection (multiple)
  const handleTeamChange = (teamName: string) => {
    setFormData(prev => {
      const currentTeams = prev.teams as string[]; // Type assertion
      const updatedTeams = currentTeams.includes(teamName)
        ? currentTeams.filter(t => t !== teamName)
        : [...currentTeams, teamName];
      return { ...prev, teams: updatedTeams };
    });
  };

  // Open modal for creating a new event
  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData({ // Reset form for new event
      name: '', date: '', location: '', responsiblePerson: '',
      teams: [], maxParticipants: 0, currentParticipants: 0,
      status: 'pending', description: ''
    });
    setIsModalOpen(true);
  };

  // Open modal for editing an event
  const openEditModal = (event: any) => {
    setEditingEvent(event);
    // Populate form with event data
    // If event._originalData exists, prefer it for editing to have full API data
    const sourceData = event._originalData || event;
    setFormData({
      name: sourceData.titulo || event.name, // Use API 'titulo' or local 'name'
      date: sourceData.data ? new Date(sourceData.data).toISOString().split('T')[0] : event.date.split(' (')[0], // Reformat for input[type=date] if needed
      location: sourceData.local || event.location,
      responsiblePerson: event.responsiblePerson, // This is still mock
      teams: sourceData.equipesParticipantes || event.teams || [],
      maxParticipants: event.maxParticipants, // Still mock
      currentParticipants: (sourceData.participantes?.length) || event.currentParticipants,
      status: sourceData.status === 'Programado' ? 'active' : (sourceData.status === 'Concluído' || sourceData.status === 'Cancelado' ? 'inactive' : 'pending'),
      description: sourceData.descricao || event.description,
    });
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Save event (create or update) - THIS IS LOCAL ONLY FOR NOW
  const saveEvent = () => {
    // TODO: Implement API call for create/update
    if (editingEvent) {
      setEvents(
        events.map(ev => 
          ev.id === editingEvent.id ? { ...ev, ...formData, id: editingEvent.id } : ev
        )
      );
    } else {
      const newEvent = {
        id: `local-${Date.now()}`, // Temp local ID
        ...formData,
      };
      setEvents([...events, newEvent]);
    }
    closeModal();
  };

  // Delete an event - THIS IS LOCAL ONLY FOR NOW
  const deleteEvent = (eventId: string | number) => {
    // TODO: Implement API call for delete
    if (confirm("Tem certeza que deseja excluir este evento?")) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  // Change event status - THIS IS LOCAL ONLY FOR NOW
  const toggleStatus = (eventId: string | number, newStatus: string) => {
    // TODO: Implement API call for status update
    setEvents(
      events.map(ev => 
        ev.id === eventId ? { ...ev, status: newStatus } : ev
      )
    );
  };

  // Filter events based on status
  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.status === filter);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Gerenciamento de Eventos</h2>
              <p className="text-gray-500 mt-1">Gerencie os eventos técnicos musicais</p>
            </div>
            <Button disabled><Plus className="mr-2 h-4 w-4" /> Novo Evento</Button>
          </div>
          <Skeleton className="w-full h-20 mb-4" />
          <Skeleton className="w-full h-64" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Gerenciamento de Eventos</h2>
              <p className="text-gray-500 mt-1">Gerencie os eventos técnicos musicais</p>
            </div>
             <Button disabled><Plus className="mr-2 h-4 w-4" /> Novo Evento</Button>
          </div>
          <p className="text-red-500">Erro ao carregar eventos: {error.message}</p>
        </div>
      </Layout>
    );
  }

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
                    <TableHead>Responsável</TableHead>
                    <TableHead className="text-center">Equipes</TableHead>
                    <TableHead>Participantes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                      <TableRow key={event.id} className="hover:bg-gray-50 cursor-pointer">
                        <TableCell>
                          <div>
                            <div className="font-medium">{event.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{event.description}</div>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                            <span>{event.date}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                            <span>{event.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-blue-500" />
                            <span>{event.responsiblePerson}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge 
                            variant="secondary" 
                            className="flex items-center justify-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-800"
                          >
                            <Users className="h-3 w-3" />
                            {Array.isArray(event.teams) ? event.teams.length : 0}
                          </Badge>
                        </TableCell>
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
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                              Ativo
                            </Badge>
                          )}
                          {event.status === 'pending' && (
                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                              Pendente
                            </Badge>
                          )}
                          {event.status === 'inactive' && (
                            <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                              Inativo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="1" />
                                  <circle cx="12" cy="5" r="1" />
                                  <circle cx="12" cy="19" r="1" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[160px]">
                              <DropdownMenuItem onClick={() => openEditModal(event)} className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Editar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => deleteEvent(event.id)} className="cursor-pointer text-red-500 focus:text-red-500">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Excluir</span>
                              </DropdownMenuItem>
                              {event.status !== 'active' && (
                                <DropdownMenuItem onClick={() => toggleStatus(event.id, 'active')} className="cursor-pointer text-green-500 focus:text-green-500">
                                  <Check className="mr-2 h-4 w-4" />
                                  <span>Ativar</span>
                                </DropdownMenuItem>
                              )}
                              {event.status === 'active' && (
                                <DropdownMenuItem onClick={() => toggleStatus(event.id, 'inactive')} className="cursor-pointer text-gray-500 focus:text-gray-500">
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
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        {isLoading ? 'Carregando eventos...' : 'Nenhum evento encontrado com os filtros atuais.'}
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
                    placeholder="DD/MM/AAAA ou AAAA-MM-DD" // Allow both for input, will be formatted on display
                    type="date" // Prefer type="date" for better UX
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
                <Label htmlFor="responsiblePerson">Pessoa Responsável</Label>
                <Select 
                  value={formData.responsiblePerson} 
                  onValueChange={handleResponsiblePersonChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockResponsiblePersons.map(person => (
                      <SelectItem key={person.id} value={person.name}>
                        {person.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Equipes Participantes</Label>
                <div className="border rounded-md p-3 space-y-2">
                  {mockTeams.map(team => (
                    <div key={team.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`team-${team.id}`}
                        checked={(formData.teams as string[]).includes(team.name)}
                        onCheckedChange={() => handleTeamChange(team.name)}
                      />
                      <label 
                        htmlFor={`team-${team.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {team.name}
                      </label>
                    </div>
                  ))}
                </div>
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
                    disabled // This should be derived from API, not directly editable
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: string) => setFormData(prev => ({...prev, status: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo (Programado)</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="inactive">Inativo (Concluído/Cancelado)</SelectItem>
                  </SelectContent>
                </Select>
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
