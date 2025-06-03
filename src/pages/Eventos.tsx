import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Calendar, MapPin, Users, Play, X } from 'lucide-react';
import { Evento } from '../../server/src/models/evento.model';
import { useToast } from '@/hooks/use-toast';

const Eventos = () => {
  const { toast } = useToast();
  // Estados para os dados dos eventos, carregamento e erro
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para o formulário
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    data: '', // Apenas a data (YYYY-MM-DD)
    horaInicio: '', // Apenas a hora (HH:mm)
    horaFim: '', // Hora de término (opcional, pode ser string vazia)
    local: '',
    descricao: '',
    status: 'Programado'
  });

  // Estado para controlar se o formulário está em modo de edição
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  // Buscar eventos ao montar o componente
  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/eventos');
      
      if (!response.ok) {
        throw new Error('Erro ao carregar eventos');
      }
      
      const data = await response.json();
      // Filtrar eventos concluídos ou cancelados
      // const eventosFiltrados = data.filter((evento: Evento) => 
      //   evento.status === 'Programado' || evento.status === 'Em Andamento'
      // );
      // setEventos(eventosFiltrados);
      setEventos(data); // Carregar todos os eventos
    } catch (err) {
      console.error('Erro ao buscar eventos:', err);
      setError('Erro ao carregar eventos. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
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
        equipesParticipantes: [],
        participantes: []
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
      await fetchEventos();
      
      // Limpar formulário e fechar modal
      setFormData({
        nome: '',
        tipo: '',
        data: '',
        horaInicio: '',
        horaFim: '',
        local: '',
        descricao: '',
        status: 'Programado'
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
    // Verificar o status antes de excluir - REMOVIDO TEMPORARIAMENTE PARA PERMITIR EXCLUSÃO PARA TESTE
    // if (evento.status !== 'Concluído' && evento.status !== 'Cancelado') {
    //     toast({
    //         variant: "destructive",
    //         title: "Ação Não Permitida",
    //         description: "Apenas eventos com status 'Concluído' ou 'Cancelado' podem ser excluídos."
    //     });
    //     return; // Interrompe a exclusão se o status não permitir
    // }

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
    const dataParte = dataCompleta.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    
    // Usar os valores de hora diretamente do evento (garantir que são strings)
    const horaInicioParte = typeof evento.horainicio === 'string' ? evento.horainicio.substring(0, 5) : '';
    const horaFimParte = typeof evento.horafim === 'string' ? evento.horafim.substring(0, 5) : '';

    console.log('Dados do evento recebidos para edição:', evento); // Debug: O evento original
    console.log('Horários extraídos:', { horaInicioParte, horaFimParte }); // Debug: Horários formatados

    setFormData({
      nome: evento.nome || '',
      tipo: evento.tipo || '',
      data: dataParte,
      local: evento.local || '',
      descricao: evento.descricao || '',
      status: evento.status || 'Programado',
      horaInicio: horaInicioParte, // Usar o valor formatado
      horaFim: horaFimParte // Usar o valor formatado
    });
    setEditandoId(evento.id);
    setModalAberto(true);
    setError(null); // Limpar erro ao abrir modal
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

              await fetchEventos();
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

          await fetchEventos();
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

      await fetchEventos();
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

      await fetchEventos();
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
          <Button onClick={() => {
            setFormData({
              nome: '',
              tipo: '',
              data: '',
              horaInicio: '',
              horaFim: '',
              local: '',
              descricao: '',
              status: 'Programado'
            });
            setEditandoId(null);
            setModalAberto(true);
          }}>
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

        {/* Modal de Formulário */}
        {modalAberto && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>{editandoId ? 'Editar Evento' : 'Novo Evento'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome do Evento</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tipo">Tipo de Evento</Label>
                    <Select
                      value={formData.tipo}
                      onValueChange={(value) => setFormData({ ...formData, tipo: value })}
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
                      type="date"
                      value={formData.data}
                      onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="horaInicio">Hora de Início</Label>
                    <Input
                      id="horaInicio"
                      type="time"
                      value={formData.horaInicio}
                      onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="horaFim">Hora de Fim</Label>
                    <Input
                      id="horaFim"
                      type="time"
                      value={formData.horaFim}
                      onChange={(e) => setFormData({ ...formData, horaFim: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="local">Local</Label>
                    <Input
                      id="local"
                      value={formData.local}
                      onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
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

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setModalAberto(false);
                        setEditandoId(null);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editandoId ? 'Salvar Alterações' : 'Criar Evento'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Eventos;
