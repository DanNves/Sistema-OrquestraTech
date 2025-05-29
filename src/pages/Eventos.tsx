import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Calendar, MapPin, Users } from 'lucide-react';
import { Evento } from '../../server/src/models/evento.model';

const Eventos = () => {
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
      setEventos(data);
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
      setError('O nome do evento é obrigatório');
      return;
    }
    if (!formData.tipo) {
      setError('O tipo do evento é obrigatório');
      return;
    }
    if (!formData.data) {
      setError('A data do evento é obrigatória');
      return;
    }
    if (!formData.horaInicio) {
      setError('A hora de início é obrigatória');
      return;
    }
    if (!formData.horaFim) {
      setError('A hora de término é obrigatória');
      return;
    }
    if (!formData.local.trim()) {
      setError('O local do evento é obrigatório');
      return;
    }

    // Validar se a hora de término é posterior à hora de início
    const horaInicio = new Date(`2000-01-01T${formData.horaInicio}`);
    const horaFim = new Date(`2000-01-01T${formData.horaFim}`);
    if (horaFim <= horaInicio) {
      setError('A hora de término deve ser posterior à hora de início');
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
    } catch (err: any) {
      console.error('Erro ao salvar evento:', err);
      setError(`Erro ao salvar evento: ${err.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este evento?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/eventos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir evento');
      }

      // Atualizar a lista de eventos
      await fetchEventos();
    } catch (err) {
      console.error('Erro ao excluir evento:', err);
      setError('Erro ao excluir evento. Tente novamente mais tarde.');
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(evento)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(evento.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Programado">Programado</SelectItem>
                        <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                        <SelectItem value="Concluído">Concluído</SelectItem>
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
