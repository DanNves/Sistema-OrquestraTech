import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Calendar, MapPin, Users, Star } from 'lucide-react';
import { Evento } from '../../server/src/models/evento.model'; // Importar a interface Evento
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import * as XLSX from 'xlsx';

// Cores para os diferentes tipos de eventos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const RelatorioEventos = () => {
  // Estados para os dados dos eventos, carregamento e erro
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para controle da paginação e pesquisa
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 5; // Ajustado para 5 itens por página

  // Estados para os filtros
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroLocal, setFiltroLocal] = useState('');

  // Hook useEffect para buscar os dados da API quando o componente montar
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setLoading(true);
        // TODO: Ajustar a URL da API se o frontend estiver em uma porta diferente do backend
        // Assume que o backend está rodando em http://localhost:3001
        const response = await fetch('http://localhost:3001/api/eventos');
        
        if (!response.ok) {
          // Lidar com respostas de erro da API (ex: 404, 500)
          const errorData = await response.json();
          throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
        }
        
        const data: Evento[] = await response.json();
        
        // Converter strings de data para objetos Date, se necessário
        // Depende de como a data é retornada pela API (Date object vs string ISO)
        const eventosComDatas = data.map(evento => ({
            ...evento,
            data: new Date(evento.data) // Exemplo: converter string ISO para Date
        }));

        setEventos(eventosComDatas);
      } catch (err) {
        console.error('Erro ao buscar eventos:', err);
        setError('Erro ao carregar eventos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []); // O array vazio garante que o useEffect roda apenas uma vez ao montar o componente

  // Filtrar eventos com base em todos os critérios
  const filteredEventos = eventos.filter(evento => {
    const matchSearch = evento.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = !filtroTipo || evento.tipo === filtroTipo;
    const matchStatus = !filtroStatus || evento.status === filtroStatus;
    const matchLocal = !filtroLocal || evento.local === filtroLocal;

    return matchSearch && matchTipo && matchStatus && matchLocal;
  });

  // Calcular estatísticas (agora baseadas em filteredEventos para refletir a pesquisa)
  const eventosPorTipo = filteredEventos.reduce((acc, evento) => {
    acc[evento.tipo] = (acc[evento.tipo] || 0) + 1;
    return acc;
  }, {});

  // Para maior participação e melhor avaliação, talvez seja melhor usar os dados originais
  // antes da filtragem para estatísticas gerais, ou basear nas estatísticas dos dados filtrados.
  // Por enquanto, mantendo baseado em filteredEventos para consistência com a tabela.

  const eventoComMaiorAvaliacao = filteredEventos
    .filter(e => e.mediaPontuacao !== undefined && e.mediaPontuacao !== null)
    .reduce((maxEvento, currentEvento) => {
      return (currentEvento.mediaPontuacao > maxEvento.mediaPontuacao) ? currentEvento : maxEvento;
    }, filteredEventos[0]);

  const eventoComMaisParticipantes = filteredEventos.reduce((maxEvento, currentEvento) => {
    // Assumindo que participantes é um array e queremos a contagem de membros
    const currentParticipantesCount = Array.isArray(currentEvento.participantes) ? currentEvento.participantes.length : 0;
    const maxParticipantesCount = maxEvento && Array.isArray(maxEvento.participantes) ? maxEvento.participantes.length : 0;
    return (currentParticipantesCount > maxParticipantesCount) ? currentEvento : maxEvento;
  }, filteredEventos[0]);

  // Calcular dados para paginação (agora baseada em filteredEventos)
  const totalPages = Math.ceil(filteredEventos.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEventosPaginados = filteredEventos.slice(indexOfFirstItem, indexOfLastItem);

  // Preparar dados para o gráfico
  const dadosGrafico = Object.entries(eventosPorTipo).map(([tipo, quantidade]) => ({
    name: tipo,
    value: quantidade
  }));

  // Função para exportar relatório
  const exportarRelatorio = () => {
    // Preparar dados para exportação
    const dadosExportacao = filteredEventos.map(evento => ({
      'Nome': evento.nome,
      'Tipo': evento.tipo,
      'Data': new Date(evento.data).toLocaleDateString(),
      'Hora Início': evento.horaInicio,
      'Hora Fim': evento.horaFim,
      'Local': evento.local,
      'Status': evento.status,
      'Participantes': Array.isArray(evento.participantes) ? evento.participantes.length : 0,
      'Avaliação Média': evento.mediaPontuacao?.toFixed(1) || 'N/A'
    }));

    // Criar planilha
    const ws = XLSX.utils.json_to_sheet(dadosExportacao);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório de Eventos');

    // Adicionar estatísticas em uma nova aba
    const estatisticas = [
      { 'Métrica': 'Total de Eventos', 'Valor': filteredEventos.length },
      { 'Métrica': 'Eventos Agendados', 'Valor': filteredEventos.filter(e => e.status === 'Programado' || e.status === 'Agendado').length },
      { 'Métrica': 'Maior Participação', 'Valor': eventoComMaisParticipantes ? (Array.isArray(eventoComMaisParticipantes.participantes) ? eventoComMaisParticipantes.participantes.length : 0) : 0 },
      { 'Métrica': 'Melhor Avaliação', 'Valor': eventoComMaiorAvaliacao ? (eventoComMaiorAvaliacao.mediaPontuacao?.toFixed(1) || 'N/A') : 'N/A' }
    ];
    const wsStats = XLSX.utils.json_to_sheet(estatisticas);
    XLSX.utils.book_append_sheet(wb, wsStats, 'Estatísticas');

    // Exportar arquivo
    XLSX.writeFile(wb, 'relatorio_eventos.xlsx');
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Relatório de Eventos</h1>

        {/* Indicador de Carregamento/Erro */}
        {loading && <div className="text-center text-blue-500 mb-4">Carregando eventos...</div>}
        {error && <div className="text-center text-red-500 mb-4">{error}</div>}

        {/* Cards de Resumo com Ícones (Condicional à existência de dados e não carregando/erro) */}
        {!loading && !error && filteredEventos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredEventos.length}</div>
                <p className="text-xs text-muted-foreground">Eventos encontrados</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Próximos Eventos</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {/* Filtrar eventos futuros/agendados */} {/* Ajustar lógica de data se necessário */}
                <div className="text-2xl font-bold">{filteredEventos.filter(e => e.status === 'Programado' || e.status === 'Agendado').length}</div>
                <p className="text-xs text-muted-foreground">Eventos agendados</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Maior Participação</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                 {eventoComMaisParticipantes ? (
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">{Array.isArray(eventoComMaisParticipantes.participantes) ? eventoComMaisParticipantes.participantes.length : 0}</span>
                    <span className="text-xs text-muted-foreground">{eventoComMaisParticipantes.nome}</span>
                  </div>
                ) : (
                   <span className="text-lg">N/A</span>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Melhor Avaliação</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                 {eventoComMaiorAvaliacao ? (
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">{eventoComMaiorAvaliacao.mediaPontuacao !== undefined ? eventoComMaiorAvaliacao.mediaPontuacao.toFixed(1) : 'N/A'}</span>
                    <span className="text-xs text-muted-foreground">{eventoComMaiorAvaliacao.nome}</span>
                  </div>
                ) : (
                   <span className="text-lg">N/A</span>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Área do Gráfico e Filtros */}
         {!loading && !error && filteredEventos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Distribuição de Eventos por Tipo</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dadosGrafico}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {dadosGrafico.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Filtros Rápidos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filtro por Tipo de Evento */}
                <div>
                  <label htmlFor="tipoEvento" className="text-sm font-medium mb-2 block">Tipo de Evento</label>
                  <select 
                    id="tipoEvento" 
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                  >
                    <option value="">Todos</option>
                    {[...new Set(eventos.map(e => e.tipo))].map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>
                {/* Filtro por Status */}
                <div>
                  <label htmlFor="statusEvento" className="text-sm font-medium mb-2 block">Status</label>
                  <select 
                    id="statusEvento" 
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                  >
                    <option value="">Todos</option>
                    {[...new Set(eventos.map(e => e.status))].map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                {/* Filtro por Local */}
                <div>
                  <label htmlFor="localEvento" className="text-sm font-medium mb-2 block">Local</label>
                  <select 
                    id="localEvento" 
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={filtroLocal}
                    onChange={(e) => setFiltroLocal(e.target.value)}
                  >
                    <option value="">Todos</option>
                    {[...new Set(eventos.map(e => e.local))].map(local => (
                      <option key={local} value={local}>{local}</option>
                    ))}
                  </select>
                </div>
                {/* Botão para limpar filtros */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    setFiltroTipo('');
                    setFiltroStatus('');
                    setFiltroLocal('');
                    setSearchTerm('');
                  }}
                >
                  Limpar Filtros
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Controles de Exportação */}
         {!loading && !error && filteredEventos.length > 0 && (
          <div className="flex justify-end mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={exportarRelatorio}
            >
              <Download className="w-4 h-4" />
              Exportar Relatório
            </Button>
          </div>
        )}

        {/* Área para Tabela de Eventos */}
         {!loading && !error && (filteredEventos.length > 0 ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Detalhes dos Eventos</CardTitle>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Pesquisar evento..."
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="outline" size="sm">
                      <MapPin className="w-4 h-4 mr-2" />
                      Mapa
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Local</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participantes</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avaliação</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentEventosPaginados.map((evento) => (
                        <tr key={evento.id}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{evento.nome}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{evento.tipo}</td>
                          {/* Exibir data formatada se for um objeto Date */}
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{evento.data instanceof Date && !isNaN(evento.data.getTime()) ? evento.data.toLocaleDateString() : 'N/A'}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{evento.local}</td>
                           {/* Contar participantes se for um array */}
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{Array.isArray(evento.participantes) ? evento.participantes.length : 'N/A'}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              evento.status === 'Concluído' ? 'bg-green-100 text-green-800' :
                              evento.status === 'Em Andamento' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {evento.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {evento.mediaPontuacao !== undefined && evento.mediaPontuacao !== null ? (
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                {evento.mediaPontuacao.toFixed(1)}
                              </div>
                            ) : 'N/A'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="link" size="sm" className="p-0 h-auto">Ver Detalhes</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Controles de Paginação */}
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-700">
                    Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredEventos.length)} de {filteredEventos.length} eventos
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
         ) : (!loading && !error && filteredEventos.length === 0 ? (
            <div className="text-center text-gray-600">Nenhum evento encontrado.</div>
         ) : null
         ))}
      </div>
    </Layout>
  );
};

export default RelatorioEventos; 