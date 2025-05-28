import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Trophy, Users, TrendingUp, BarChart2 } from 'lucide-react';

const RelatorioEquipes = () => {
  // Dados mockados de exemplo para a tabela de equipes
  const equipes = [
    { id: 1, nome: 'Coral Jovem', lider: 'Maria Souza', membros: 25, eventos: 8, mediaPontos: 95, status: 'Ativo', categoria: 'Coral', evolucao: '+5%' },
    { id: 2, nome: 'Orquestra Sinfônica', lider: 'João Silva', membros: 35, eventos: 12, mediaPontos: 92, status: 'Ativo', categoria: 'Orquestra', evolucao: '+3%' },
    { id: 3, nome: 'Grupo de Percussão', lider: 'Pedro Santos', membros: 15, eventos: 6, mediaPontos: 88, status: 'Ativo', categoria: 'Percussão', evolucao: '+7%' },
    { id: 4, nome: 'Coral Infantil', lider: 'Ana Costa', membros: 20, eventos: 5, mediaPontos: 85, status: 'Ativo', categoria: 'Coral', evolucao: '+2%' },
    { id: 5, nome: 'Grupo de Câmara', lider: 'Carlos Pereira', membros: 12, eventos: 4, mediaPontos: 90, status: 'Ativo', categoria: 'Câmara', evolucao: '+4%' },
    { id: 6, nome: 'Banda Marcial', lider: 'Sofia Lima', membros: 30, eventos: 10, mediaPontos: 87, status: 'Ativo', categoria: 'Banda', evolucao: '+6%' },
    { id: 7, nome: 'Coral de Câmara', lider: 'Fernanda Rocha', membros: 18, eventos: 7, mediaPontos: 93, status: 'Ativo', categoria: 'Coral', evolucao: '+8%' },
    { id: 8, nome: 'Grupo de Jazz', lider: 'Rafael Mendes', membros: 14, eventos: 5, mediaPontos: 89, status: 'Ativo', categoria: 'Jazz', evolucao: '+1%' },
    { id: 9, nome: 'Coral Gospel', lider: 'Isabela Gomes', membros: 22, eventos: 9, mediaPontos: 91, status: 'Ativo', categoria: 'Coral', evolucao: '+9%' },
  ];

  // Estado para controle da paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(equipes.length / itemsPerPage);

  // Calcular as equipes da página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEquipes = equipes.slice(indexOfFirstItem, indexOfLastItem);

  // Estatísticas
  const equipesPorCategoria = equipes.reduce((acc, equipe) => {
    acc[equipe.categoria] = (acc[equipe.categoria] || 0) + 1;
    return acc;
  }, {});

  const equipeComMaiorPontuacao = equipes.reduce((maxEquipe, currentEquipe) => {
    return (currentEquipe.mediaPontos > maxEquipe.mediaPontos) ? currentEquipe : maxEquipe;
  }, equipes[0]);

  const equipeComMaisEventos = equipes.reduce((maxEquipe, currentEquipe) => {
    return (currentEquipe.eventos > maxEquipe.eventos) ? currentEquipe : maxEquipe;
  }, equipes[0]);

  const mediaGeral = equipes.reduce((acc, equipe) => acc + equipe.mediaPontos, 0) / equipes.length;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Estatísticas de Equipes</h1>

        {/* Cards de Resumo com Ícones */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mediaGeral.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Pontos médios</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Maior Pontuação</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{equipeComMaiorPontuacao.mediaPontos}</div>
              <p className="text-xs text-muted-foreground">{equipeComMaiorPontuacao.nome}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Mais Eventos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{equipeComMaisEventos.eventos}</div>
              <p className="text-xs text-muted-foreground">{equipeComMaisEventos.nome}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{equipes.reduce((total, equipe) => total + equipe.membros, 0)}</div>
              <p className="text-xs text-muted-foreground">Participantes ativos</p>
            </CardContent>
          </Card>
        </div>

        {/* Área do Gráfico e Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Distribuição de Equipes por Categoria</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[300px] bg-gray-50 rounded-md">
              {/* Espaço reservado para o gráfico de pizza */}
              <div className="text-center">
                <BarChart2 size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Gráfico de Distribuição por Categoria (em breve)</p>
              </div>
              {/* Integração com biblioteca de gráficos como Chart.js ou Recharts será feita aqui */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Filtros Rápidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Categoria</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">Todas</option>
                  {Object.keys(equipesPorCategoria).map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Faixa de Pontos</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">Todas</option>
                  <option value="90-100">90-100 pontos</option>
                  <option value="80-89">80-89 pontos</option>
                  <option value="70-79">70-79 pontos</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Número de Membros</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">Todos</option>
                  <option value="1-10">1-10 membros</option>
                  <option value="11-20">11-20 membros</option>
                  <option value="21+">21+ membros</option>
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

        {/* Área para Tabela de Equipes */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Detalhes das Equipes</CardTitle>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Pesquisar equipe..."
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <Button variant="outline" size="sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Comparar
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Líder</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membros</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eventos</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Média</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evolução</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentEquipes.map((equipe) => (
                    <tr key={equipe.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{equipe.nome}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{equipe.categoria}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{equipe.lider}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{equipe.membros}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{equipe.eventos}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${equipe.mediaPontos}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{equipe.mediaPontos}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-green-600">{equipe.evolucao}</span>
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
                Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, equipes.length)} de {equipes.length} equipes
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

export default RelatorioEquipes; 