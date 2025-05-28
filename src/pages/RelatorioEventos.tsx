import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Calendar, MapPin, Users, Star } from 'lucide-react';

const RelatorioEventos = () => {
  // Dados mockados de exemplo para a tabela de eventos
  const eventos = [
    { id: 1, nome: 'Festival de Música 2024', data: '15/03/2024', local: 'Auditório Principal', participantes: 120, status: 'Concluído', avaliacao: 4.8, tipo: 'Festival' },
    { id: 2, nome: 'Workshop de Canto', data: '22/03/2024', local: 'Sala de Ensaios', participantes: 45, status: 'Em Andamento', avaliacao: 4.5, tipo: 'Workshop' },
    { id: 3, nome: 'Ensaio Geral', data: '29/03/2024', local: 'Palco Principal', participantes: 80, status: 'Agendado', avaliacao: null, tipo: 'Ensaio' },
    { id: 4, nome: 'Apresentação Coral', data: '05/04/2024', local: 'Teatro Municipal', participantes: 150, status: 'Agendado', avaliacao: null, tipo: 'Apresentação' },
    { id: 5, nome: 'Masterclass de Piano', data: '12/04/2024', local: 'Sala de Música', participantes: 30, status: 'Agendado', avaliacao: null, tipo: 'Masterclass' },
    { id: 6, nome: 'Concerto de Páscoa', data: '19/04/2024', local: 'Igreja Central', participantes: 200, status: 'Agendado', avaliacao: null, tipo: 'Concerto' },
    { id: 7, nome: 'Ensaio de Natal', data: '20/12/2023', local: 'Auditório Principal', participantes: 100, status: 'Concluído', avaliacao: 4.9, tipo: 'Ensaio' },
    { id: 8, nome: 'Workshop de Percussão', data: '10/01/2024', local: 'Sala de Ensaios', participantes: 35, status: 'Concluído', avaliacao: 4.7, tipo: 'Workshop' },
    { id: 9, nome: 'Apresentação de Verão', data: '15/02/2024', local: 'Praça Central', participantes: 180, status: 'Concluído', avaliacao: 4.6, tipo: 'Apresentação' },
  ];

  // Estado para controle da paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(eventos.length / itemsPerPage);

  // Calcular os eventos da página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEventos = eventos.slice(indexOfFirstItem, indexOfLastItem);

  // Estatísticas
  const eventosPorTipo = eventos.reduce((acc, evento) => {
    acc[evento.tipo] = (acc[evento.tipo] || 0) + 1;
    return acc;
  }, {});

  const eventoComMaiorAvaliacao = eventos
    .filter(e => e.avaliacao !== null)
    .reduce((maxEvento, currentEvento) => {
      return (currentEvento.avaliacao > maxEvento.avaliacao) ? currentEvento : maxEvento;
    }, eventos[0]);

  const eventoComMaisParticipantes = eventos.reduce((maxEvento, currentEvento) => {
    return (currentEvento.participantes > maxEvento.participantes) ? currentEvento : maxEvento;
  }, eventos[0]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Relatório de Eventos</h1>

        {/* Cards de Resumo com Ícones */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventos.length}</div>
              <p className="text-xs text-muted-foreground">Eventos cadastrados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Próximos Eventos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventos.filter(e => e.status === 'Agendado').length}</div>
              <p className="text-xs text-muted-foreground">Eventos agendados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Maior Participação</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventoComMaisParticipantes.participantes}</div>
              <p className="text-xs text-muted-foreground">{eventoComMaisParticipantes.nome}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Melhor Avaliação</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventoComMaiorAvaliacao.avaliacao}</div>
              <p className="text-xs text-muted-foreground">{eventoComMaiorAvaliacao.nome}</p>
            </CardContent>
          </Card>
        </div>

        {/* Área do Gráfico e Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Distribuição de Eventos por Tipo</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[250px] bg-gray-50 rounded-md">
              <div className="grid grid-cols-2 gap-4 w-full">
                {Object.entries(eventosPorTipo).map(([tipo, quantidade]) => (
                  <div key={tipo} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <span className="font-medium">{tipo}</span>
                    <span className="text-lg font-bold">{quantidade}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Filtros Rápidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Tipo de Evento</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">Todos</option>
                  {Object.keys(eventosPorTipo).map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">Todos</option>
                  <option value="Agendado">Agendado</option>
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Concluído">Concluído</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Local</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">Todos</option>
                  {[...new Set(eventos.map(e => e.local))].map(local => (
                    <option key={local} value={local}>{local}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controles de Exportação */}
        <div className="flex justify-end mb-4">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar Relatório
          </Button>
        </div>

        {/* Área para Tabela de Eventos */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Detalhes dos Eventos</CardTitle>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Pesquisar evento..."
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                  {currentEventos.map((evento) => (
                    <tr key={evento.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{evento.nome}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{evento.tipo}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{evento.data}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{evento.local}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{evento.participantes}</td>
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
                        {evento.avaliacao ? (
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            {evento.avaliacao}
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
                Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, eventos.length)} de {eventos.length} eventos
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
      </div>
    </Layout>
  );
};

export default RelatorioEventos; 