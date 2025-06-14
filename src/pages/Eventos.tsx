import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Calendar, MapPin, Users, Play, X, Check, ChevronsUpDown } from 'lucide-react';
import { Evento } from '../../server/src/models/evento.model';
import { Equipe } from '../../server/src/models/equipe.model';
import { Usuario } from '../../server/src/models/usuario.model';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from "@/lib/utils";

const Eventos = () => {
  const { toast } = useToast();
  // Estados para os dados dos eventos, carregamento e erro
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Novos estados para equipes e usuários
  const [equipesDisponiveis, setEquipesDisponiveis] = useState<Equipe[]>([]);
  const [usuariosDisponiveis, setUsuariosDisponiveis] = useState<Usuario[]>([]);

  // Estado para o formulário
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    data: '', // Apenas a data (YYYY-MM-DD)
    horaInicio: '', // Apenas a hora (HH:mm)
    horaFim: '', // Hora de término (opcional, pode ser string vazia)
    local: '',
    descricao: '',
    status: 'Programado',
    equipesParticipantes: [] as string[], // IDs das equipes
    participantes: [] as string[], // IDs dos participantes diretos
  });

  // Estado para controlar se o formulário está em modo de edição
  const [editandoId, setEditandoId] = useState<string | null>(null); // Change to string for ID
  const [modalAberto, setModalAberto] = useState(false);

  // Buscar eventos, equipes e usuários ao montar o componente
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [eventsRes, equipesRes, usersRes] = await Promise.all([
        axios.get('http://localhost:3001/api/eventos'),
        axios.get('http://localhost:3001/api/equipes'),
        axios.get('http://localhost:3001/api/usuarios'),
      ]);

      setEventos(eventsRes.data);
      setEquipesDisponiveis(equipesRes.data);
      setUsuariosDisponiveis(usersRes.data);
    } catch (err: any) {
      console.error('Erro ao buscar dados:', err);
      setError('Erro ao carregar dados. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (name: string, id: string, isChecked: boolean) => {
    setFormData(prev => {
      const currentIds = prev[name as keyof typeof prev] as string[];
      if (isChecked) {
        return { ...prev, [name]: [...currentIds, id] };
      } else {
        return { ...prev, [name]: currentIds.filter(item => item !== id) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações antes de enviar
    if (!formData.nome.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "O nome do evento é obrigatório"
      });
      return;
    }
    if (!formData.tipo) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "O tipo do evento é obrigatório"
      });
      return;
    }
    if (!formData.data) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "A data do evento é obrigatória"
      });
      return;
    }
    if (!formData.horaInicio) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "A hora de início é obrigatória"
      });
      return;
    }
    if (!formData.horaFim) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "A hora de término é obrigatória"
      });
      return;
    }
    if (!formData.local.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "O local do evento é obrigatório"
      });
      return;
    }

    // Validar se a hora de término é posterior à hora de início
    const horaInicio = new Date(`2000-01-01T${formData.horaInicio}`);
    const horaFim = new Date(`2000-01-01T${formData.horaFim}`);
    if (horaFim <= horaInicio) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "A hora de término deve ser posterior à hora de início"
      });
      return;
    }
    
    try {
      const url = editandoId 
        ? `http://localhost:3001/api/eventos/${editandoId}`
        : 'http://localhost:3001/api/eventos';
      
      const method = editandoId ? 'PUT' : 'POST';
      
      // Garantir que os dados estão no formato correto
      const dataToSend = {
        nome: formData.nome.trim(),
        tipo: formData.tipo,
        data: formData.data,
        horaInicio: formData.horaInicio,
        horaFim: formData.horaFim,
        local: formData.local.trim(),
        descricao: formData.descricao.trim(),
        status: formData.status,
        // Agora passando os valores selecionados do formulário
        equipesParticipantes: formData.equipesParticipantes,
        participantes: formData.participantes,
      };

      console.log('Enviando dados:', dataToSend); // Debug

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Erro ao salvar evento: ${errorResponse.message}`);
      }

      // Atualizar a lista de eventos
      await fetchData(); // Call fetchData to re-fetch all data including teams and users
      
      // Limpar formulário e fechar modal
      setFormData({
        nome: '',
        tipo: '',
        data: '',
        horaInicio: '',
        horaFim: '',
        local: '',
        descricao: '',
        status: 'Programado',
        equipesParticipantes: [],
        participantes: [],
      });
      setEditandoId(null);
      setModalAberto(false);
      setError(null);

      // Mostrar mensagem de sucesso
      toast({
        title: "Sucesso",
        description: editandoId ? "Evento atualizado com sucesso!" : "Evento criado com sucesso!"
      });
    } catch (err: any) {
      console.error('Erro ao salvar evento:', err);
      toast({
        variant: "destructive",
        title: "Erro",
        description: err.message
      });
    }
  };

  const handleDelete = async (evento: Evento) => {
    if (!window.confirm(`Tem certeza que deseja excluir o evento "${evento.nome}"?`)) {
      return;
    }

    try {
      // Chamar a rota DELETE /api/eventos/:id
      // Assumindo que o backend DELETE /api/eventos/:id não precisa de corpo na requisição
      const response = await fetch(`http://localhost:3001/api/eventos/${evento.id}`, {
        method: 'DELETE',
        headers: {
           'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Manter autenticação para rota protegida
        },
      });

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Erro ao excluir evento: ${errorResponse.message}`);
      }

      // Atualizar a lista de eventos removendo o evento excluído localmente
      setEventos(eventos.filter(e => e.id !== evento.id));

      // Mostrar mensagem de sucesso
      toast({
        title: "Sucesso",
        description: "Evento excluído com sucesso!"
      });
    } catch (err: any) {
      console.error('Erro ao excluir evento:', err);
      toast({
        variant: "destructive",
        title: "Erro",
        description: err.message
      });
    }
  };

  const handleEdit = (evento: Evento) => {
    // Separar data e hora para preencher o formulário
    const dataCompleta = new Date(evento.data);

    // Populate the form data, including teams and participants
    setFormData({
      nome: evento.nome || '',
      tipo: evento.tipo || '',
      data: evento.data ? new Date(evento.data).toISOString().split('T')[0] : '', // Format date to YYYY-MM-DD
      horaInicio: evento.horaInicio || '',
      horaFim: evento.horaFim || '',
      local: evento.local || '',
      descricao: evento.descricao || '',
      status: evento.status || 'Programado',
      equipesParticipantes: Array.isArray(evento.equipesParticipantes) ? evento.equipesParticipantes : [],
      participantes: Array.isArray(evento.participantes) ? evento.participantes : [],
    });
    setEditandoId(evento.id);
    setModalAberto(true);
  };

  const openCreateModal = () => {
    setEditandoId(null);
    setFormData({
      nome: '',
      tipo: '',
      data: '',
      horaInicio: '',
      horaFim: '',
      local: '',
      descricao: '',
      status: 'Programado',
      equipesParticipantes: [],
      participantes: [],
    });
    setModalAberto(true);
  };

  const closeFormModal = () => {
    setModalAberto(false);
    setEditandoId(null);
    setFormData({
      nome: '',
      tipo: '',
      data: '',
      horaInicio: '',
      horaFim: '',
      local: '',
      descricao: '',
      status: 'Programado',
      equipesParticipantes: [],
      participantes: [],
    });
  };

  // Função para iniciar um evento
  const handleStartEvent = async (evento: Evento) => {
    try {
      console.log('Iniciando evento:', evento);
      console.log('Token:', localStorage.getItem('authToken'));

      // Não é necessário verificar o evento separadamente antes de atualizar
      // A requisição PUT para atualização já irá retornar 404 se não existir ou 401 se não autorizado.

      // Agora vamos atualizar o status
      const response = await fetch(`http://localhost:3001/api/eventos/${evento.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          // Enviar apenas as propriedades que queremos atualizar
          status: 'Em Andamento'
          // Se precisar atualizar outros campos, adicione-os aqui:
          // nome: evento.nome,
          // data: evento.data,
          // ... outros campos permitidos ...
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Erro ao iniciar evento: ${errorData.message || response.statusText}`);
      }

      // Configurar timer para concluir o evento
      try {
        const dataEvento = new Date(evento.data);
        const [horas, minutos] = evento.horafim.split(':');
        
        console.log('Data original do evento:', evento.data);
        console.log('Hora de término:', evento.horafim);
        console.log('Horas e minutos extraídos:', { horas, minutos });
        
        dataEvento.setHours(parseInt(horas), parseInt(minutos), 0, 0);
        
        const agora = new Date();
        const tempoParaConcluir = dataEvento.getTime() - agora.getTime();

        console.log('Data do evento após ajuste:', dataEvento);
        console.log('Data atual:', agora);
        console.log('Tempo para concluir (ms):', tempoParaConcluir);

        if (tempoParaConcluir > 0) {
          console.log('Configurando timer para concluir em:', new Date(agora.getTime() + tempoParaConcluir));
          
          setTimeout(async () => {
            try {
              console.log('Executando conclusão automática do evento:', evento.nome);
              const response = await fetch(`http://localhost:3001/api/eventos/${evento.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({
                  // Enviar apenas o status para concluir
                  status: 'Concluído'
                }),
              });

              if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(`Erro ao concluir evento: ${errorData.message || response.statusText}`);
              }

              await fetchData();
              toast({
                title: "Evento Concluído",
                description: `O evento "${evento.nome}" foi concluído automaticamente.`
              });
            } catch (error: any) {
              console.error('Erro ao concluir evento automaticamente:', error);
              toast({
                variant: "destructive",
                title: "Erro",
                description: `Erro ao concluir evento automaticamente: ${error.message}`
              });
            }
          }, tempoParaConcluir);
        } else {
          console.log('Tempo já passou, concluindo evento imediatamente');
          const response = await fetch(`http://localhost:3001/api/eventos/${evento.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: JSON.stringify({
              status: 'Concluído'
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(`Erro ao concluir evento: ${errorData.message || response.statusText}`);
          }

          await fetchData();
          toast({
            title: "Evento Concluído",
            description: `O evento "${evento.nome}" foi concluído.`
          });
        }
      } catch (error: any) {
        console.error('Erro ao configurar timer:', error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: `Erro ao configurar timer: ${error.message}`
        });
      }

      await fetchData();
      toast({
        title: "Sucesso",
        description: "Evento iniciado com sucesso!"
      });
    } catch (err: any) {
      console.error('Erro ao iniciar evento:', err);
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Erro ao iniciar evento: ${err.message}`
      });
    }
  };

  // Função para cancelar um evento
  const handleCancelEvent = async (evento: Evento) => {
    if (!window.confirm('Tem certeza que deseja cancelar este evento?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/eventos/${evento.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          status: 'Cancelado'
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Erro ao cancelar evento: ${errorResponse.message || response.statusText}`);
      }

      await fetchData();
      toast({
        title: "Sucesso",
        description: "Evento cancelado com sucesso!"
      });
    } catch (err) {
      console.error('Erro ao cancelar evento:', err);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao cancelar evento. Tente novamente mais tarde."
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Eventos</h1>
          <Button onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Evento
          </Button>
        </div>

        {/* Indicador de Carregamento/Erro */}
        {loading && <div className="text-center text-blue-500 mb-4">Carregando eventos...</div>}
        {error && <div className="text-center text-red-500 mb-4">{error}</div>}

        {/* Lista de Eventos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventos.map((evento) => (
            <Card key={evento.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{evento.nome}</span>
                  <div className="flex gap-2">
                    {/* Botões para status Programado */}
                    {evento.status === 'Programado' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(evento)}
                          title="Editar evento"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                         {/* Botão Iniciar para status Programado */}
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => handleStartEvent(evento)}
                           className="text-green-600 hover:text-green-700"
                           title="Iniciar evento"
                         >
                           <Play className="w-4 h-4" />
                         </Button>
                         {/* Botão Cancelar para status Programado */}
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => handleCancelEvent(evento)}
                           title="Cancelar evento"
                         >
                           <X className="w-4 h-4" /> {/* Ícone de X para cancelar */}
                         </Button>
                      </>
                    )}

                     {/* Botões para status Em Andamento */}
                     {evento.status === 'Em Andamento' && (
                       <>
                         {/* Botão Cancelar para status Em Andamento */}
                          <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => handleCancelEvent(evento)}
                           title="Cancelar evento"
                         >
                           <X className="w-4 h-4" /> {/* Ícone de X para cancelar */}
                         </Button>
                       </>
                     )}

                     {/* Botão Excluir - Visível apenas para Concluído ou Cancelado */}
                     {(evento.status === 'Concluído' || evento.status === 'Cancelado') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(evento)}
                          title="Excluir evento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(evento.data).toLocaleDateString()} • {evento.horainicio?.substring(0, 5) || '--:--'} - {evento.horafim?.substring(0, 5) || '--:--'}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    {evento.local}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-2" />
                    {evento.tipo}
                  </div>
                  <div className="mt-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      evento.status === 'Concluído' ? 'bg-green-100 text-green-800' :
                      evento.status === 'Em Andamento' ? 'bg-yellow-100 text-yellow-800' :
                      evento.status === 'Cancelado' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {evento.status}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal de Criação/Edição de Evento */}
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${modalAberto ? '' : 'hidden'}`}
        >
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {editandoId ? 'Editar Evento' : 'Criar Novo Evento'}
              </h3>
              <Button variant="ghost" onClick={closeFormModal}>
                <X className="w-5 h-5 text-gray-500" />
              </Button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="nome">Nome do Evento</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="tipo">Tipo de Evento</Label>
                  <Select
                    name="tipo"
                    value={formData.tipo}
                    onValueChange={(value) => handleSelectChange('tipo', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ensaio de Seção">Ensaio de Seção</SelectItem>
                      <SelectItem value="Ensaio Geral">Ensaio Geral</SelectItem>
                      <SelectItem value="Encontro Técnico">Encontro Técnico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="data">Data</Label>
                  <Input
                    id="data"
                    name="data"
                    type="date"
                    value={formData.data}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="horaInicio">Hora de Início</Label>
                  <Input
                    id="horaInicio"
                    name="horaInicio"
                    type="time"
                    value={formData.horaInicio}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="horaFim">Hora de Fim</Label>
                  <Input
                    id="horaFim"
                    name="horaFim"
                    type="time"
                    value={formData.horaFim}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="local">Local</Label>
                  <Input
                    id="local"
                    name="local"
                    value={formData.local}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    name="status"
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange('status', value)}
                    disabled={editandoId !== null} // Desabilitar se estiver editando
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Programado">Programado</SelectItem>
                      <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                      <SelectItem value="Concluído">Concluído</SelectItem>
                      <SelectItem value="Cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Campo para Equipes Participantes (Multi-select) */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="equipesParticipantes" className="text-right">Equipes Participantes</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="col-span-3 justify-between"
                      >
                        {formData.equipesParticipantes.length > 0
                          ? `${formData.equipesParticipantes.length} selecionada(s)`
                          : "Selecionar equipes..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Buscar equipe..." />
                        <CommandEmpty>Nenhuma equipe encontrada.</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            {equipesDisponiveis.map((equipe) => (
                              <CommandItem
                                key={equipe.id}
                                onSelect={() => handleMultiSelectChange('equipesParticipantes', equipe.id, !formData.equipesParticipantes.includes(equipe.id))}
                              >
                                <Checkbox
                                  checked={formData.equipesParticipantes.includes(equipe.id)}
                                  onCheckedChange={(checked) => handleMultiSelectChange('equipesParticipantes', equipe.id, checked === true)}
                                  className="mr-2"
                                />
                                {equipe.nome}
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    formData.equipesParticipantes.includes(equipe.id)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Campo para Participantes Diretos (manter como input por enquanto, será atualizado depois) */}
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="participantes" className="text-right">Participantes Diretos</Label>
                    <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant="outline"
                        role="combobox"
                        className="col-span-3 justify-between"
                        >
                        {formData.participantes.length > 0
                            ? `${formData.participantes.length} selecionado(s)`
                            : "Selecionar participantes..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                        <CommandInput placeholder="Buscar participante..." />
                        <CommandEmpty>Nenhum participante encontrado.</CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                            {usuariosDisponiveis.map((usuario) => (
                                <CommandItem
                                key={usuario.id}
                                onSelect={() => handleMultiSelectChange('participantes', usuario.id, !formData.participantes.includes(usuario.id))}
                                >
                                <Checkbox
                                    checked={formData.participantes.includes(usuario.id)}
                                    onCheckedChange={(checked) => handleMultiSelectChange('participantes', usuario.id, checked === true)}
                                    className="mr-2"
                                />
                                {usuario.nome}
                                <Check
                                    className={cn(
                                    "ml-auto h-4 w-4",
                                    formData.participantes.includes(usuario.id)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                />
                                </CommandItem>
                            ))}
                            </CommandGroup>
                        </CommandList>
                        </Command>
                    </PopoverContent>
                    </Popover>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={closeFormModal}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white">
                  {editandoId ? 'Salvar Alterações' : 'Criar Evento'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Eventos;
