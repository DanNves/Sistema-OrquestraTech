import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Calendar, Users, TrendingUp, CheckCircle2, XCircle, Clock } from 'lucide-react';

const RelatorioInscricoes = () => {
  // Dados mockados de exemplo para a tabela de inscrições
  const inscricoes = [
    { id: 1, evento: 'Festival de Música 2024', equipe: 'Coral Jovem', membros: 25, confirmados: 22, status: 'Confirmado', data: '15/03/2024', taxaConfirmacao: '88%' },
    { id: 2, evento: 'Workshop de Canto', equipe: 'Orquestra Sinfônica', membros: 35, confirmados: 30, status: 'Confirmado', data: '22/03/2024', taxaConfirmacao: '86%' },
    { id: 3, evento: 'Ensaio Geral', equipe: 'Grupo de Percussão', membros: 15, confirmados: 12, status: 'Pendente', data: '29/03/2024', taxaConfirmacao: '80%' },
    { id: 4, evento: 'Apresentação Coral', equipe: 'Coral Infantil', membros: 20, confirmados: 18, status: 'Confirmado', data: '05/04/2024', taxaConfirmacao: '90%' },
    { id: 5, evento: 'Masterclass de Piano', equipe: 'Grupo de Câmara', membros: 12, confirmados: 10, status: 'Pendente', data: '12/04/2024', taxaConfirmacao: '83%' },
    { id: 6, evento: 'Concerto de Páscoa', equipe: 'Banda Marcial', membros: 30, confirmados: 28, status: 'Confirmado', data: '19/04/2024', taxaConfirmacao: '93%' },
    { id: 7, evento: 'Ensaio de Natal', equipe: 'Coral de Câmara', membros: 18, confirmados: 15, status: 'Cancelado', data: '20/12/2023', taxaConfirmacao: '0%' },
    { id: 8, evento: 'Workshop de Percussão', equipe: 'Grupo de Jazz', membros: 14, confirmados: 12, status: 'Confirmado', data: '10/01/2024', taxaConfirmacao: '86%' },
    { id: 9, evento: 'Apresentação de Verão', equipe: 'Coral Gospel', membros: 22, confirmados: 20, status: 'Confirmado', data: '15/02/2024', taxaConfirmacao: '91%' },
  ];

  // Estado para controle da paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(inscricoes.length / itemsPerPage);

  // Calcular as inscrições da página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInscricoes = inscricoes.slice(indexOfFirstItem, indexOfLastItem);

  // Estatísticas
  const totalInscricoes = inscricoes.length;
  const totalConfirmados = inscricoes.reduce((total, inscricao) => total + inscricao.confirmados, 0);
  const totalPendentes = inscricoes.filter(i => i.status === 'Pendente').length;
  const totalCancelados = inscricoes.filter(i => i.status === 'Cancelado').length;
  const taxaParticipacao = ((totalConfirmados / inscricoes.reduce((total, inscricao) => total + inscricao.membros, 0)) * 100).toFixed(1);
  const eventoMaisPopular = inscricoes.reduce((max, current) => 
    current.membros > max.membros ? current : max
  , inscricoes[0]);

  // Agrupar inscrições por status
  const inscricoesPorStatus = inscricoes.reduce((acc, inscricao) => {
    acc[inscricao.status] = (acc[inscricao.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Relatório de Inscrições</h1>

        {/* Cards de Resumo com Ícones */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Inscrições</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInscricoes}</div>
              <p className="text-xs text-muted-foreground">Inscrições realizadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Participação</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taxaParticipacao}%</div>
              <p className="text-xs text-muted-foreground">Média de participação</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalConfirmados}</div>
              <p className="text-xs text-muted-foreground">Participantes confirmados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPendentes}</div>
              <p className="text-xs text-muted-foreground">Aguardando confirmação</p>
            </CardContent>
          </Card>
        </div>

        {/* Área do Gráfico e Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Distribuição por Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(inscricoesPorStatus).map(([status, quantidade]) => (
                  <div key={status} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        {status === 'Confirmado' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        ) : status === 'Pendente' ? (
                          <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500 mr-2" />
                        )}
                        <span className="font-medium">{status}</span>
                      </div>
                      <span className="text-sm text-gray-500">{quantidade} inscrições</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          status === 'Confirmado' ? 'bg-green-500' :
                          status === 'Pendente' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${(quantidade / totalInscricoes) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">
                        {((quantidade / totalInscricoes) * 100).toFixed(1)}% do total
                      </span>
                    </div>
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
                <label className="text-sm font-medium mb-2 block">Status</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">Todos</option>
                  <option value="Confirmado">Confirmado</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Período</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">Todos</option>
                  <option value="hoje">Hoje</option>
                  <option value="semana">Esta Semana</option>
                  <option value="mes">Este Mês</option>
                  <option value="trimestre">Último Trimestre</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Taxa de Confirmação</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">Todas</option>
                  <option value="90-100">90-100%</option>
                  <option value="80-89">80-89%</option>
                  <option value="70-79">70-79%</option>
                  <option value="0-69">0-69%</option>
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

        {/* Área para Tabela de Inscrições */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Detalhes das Inscrições</CardTitle>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Pesquisar inscrição..."
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Calendário
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evento</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipe</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membros</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confirmados</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taxa</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentInscricoes.map((inscricao) => (
                    <tr key={inscricao.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inscricao.evento}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{inscricao.equipe}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{inscricao.membros}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{inscricao.confirmados}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className={`h-2 rounded-full ${
                                parseFloat(inscricao.taxaConfirmacao) >= 90 ? 'bg-green-500' :
                                parseFloat(inscricao.taxaConfirmacao) >= 80 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: inscricao.taxaConfirmacao }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{inscricao.taxaConfirmacao}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          inscricao.status === 'Confirmado' ? 'bg-green-100 text-green-800' :
                          inscricao.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {inscricao.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{inscricao.data}</td>
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
                Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, inscricoes.length)} de {inscricoes.length} inscrições
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

export default RelatorioInscricoes; 