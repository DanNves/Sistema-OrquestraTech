import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import axios from 'axios';
// Podemos adicionar um componente de gráfico aqui futuramente, ex: import { LineChart } from 'recharts';

const RelatorioUsuarios = () => {
  // Buscar usuários reais da API
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/api/usuarios');
        setUsers(response.data);
      } catch (err) {
        setError('Erro ao buscar usuários');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  // Encontrar o usuário com o maior score (se existir campo score)
  const userWithHighestScore = users.reduce((maxUser, currentUser) => {
    return (currentUser.score > (maxUser?.score || 0)) ? currentUser : maxUser;
  }, users[0] || {});

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Relatório de Usuários</h1>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Total de Usuários</CardTitle>
              <CardDescription>Inclui todos os cadastrados</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold">{users.length}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ativos / Inativos</CardTitle>
              <CardDescription>Usuários ativos e inativos</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-lg">{users.filter(u => u.status === 'Ativo').length} ativos / {users.filter(u => u.status === 'Inativo').length} inativos</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Maior Score</CardTitle>
              <CardDescription>Usuário com maior pontuação</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-lg font-bold">{userWithHighestScore?.nome || '-'}</span>
              <span className="ml-2">{userWithHighestScore?.score || '-'}</span>
            </CardContent>
          </Card>
        </div>

        {/* Área do Gráfico (Placeholder) */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Distribuição de Usuários por Equipe/Status</CardTitle>
            {/* <CardDescription>Visualização em formato de BI</CardDescription> */}
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-[250px] bg-gray-50 rounded-md">
             <span>Espaço para o gráfico (em breve)</span>
             {/* Aqui entrará o componente do gráfico */}
          </CardContent>
        </Card>


        {/* Controles de Filtro e Exportação */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Filtrar por Equipe</Button>
            <Button variant="outline" size="sm">Filtrar por Cargo</Button>
            <Button variant="outline" size="sm">Filtrar por Status</Button>
          </div>
          <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" /> Exportar Excel/PDF</Button>
        </div>

        {/* Área para Tabela de Usuários */}
        {loading ? (
          <div>Carregando...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : users.length === 0 ? (
          <div>Nenhum usuário encontrado.</div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Detalhes dos Usuários</CardTitle>
              <div className="mt-2">
                 <input
                  type="text"
                  placeholder="Pesquisar usuário..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                 />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipe</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.nome}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{user.equipe}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{user.cargo}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{user.status}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{user.score}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="link" size="sm" className="p-0 h-auto">Ver Perfil</Button> {/* Botão/Link para ver perfil individual */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Controles de Paginação */}
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="mr-2"
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
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default RelatorioUsuarios; 