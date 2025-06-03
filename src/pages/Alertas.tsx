import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Alerta {
  id: string;
  tipo: 'Ausência' | 'Baixa Pontuação' | 'Inscrição Baixa' | 'Sugestão';
  mensagem: string;
  data: string;
  eventoRelacionadoId?: string;
  read: boolean;
  created_at: string;
}

const Alertas = () => {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlertas = async () => {
      try {
        // Assumindo que seu backend roda em http://localhost:3001
        const response = await axios.get('http://localhost:3001/api/alertas-ia');
        setAlertas(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar alertas:', err);
        setError('Não foi possível carregar os alertas.');
        setLoading(false);
      }
    };

    fetchAlertas();
  }, []); // O array vazio garante que o efeito roda apenas uma vez após a montagem inicial

  return (
    <Layout>
      <Card>
        <CardHeader>
          <CardTitle>Alertas do Sistema</CardTitle>
          <CardDescription>Visualize e gerencie os alertas gerados pelo sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <p>Carregando alertas...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && !error && alertas.length === 0 && <p>Nenhum alerta encontrado.</p>}
          {!loading && !error && alertas.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Mensagem</TableHead>
                    <TableHead>Data</TableHead>
                    {/* <TableHead>Lido</TableHead> */} {/* Adicionar coluna para status lido/não lido */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alertas.map(alerta => (
                    <TableRow key={alerta.id}>
                      <TableCell className="font-medium">{alerta.tipo}</TableCell>
                      <TableCell>{alerta.mensagem}</TableCell>
                      <TableCell>{new Date(alerta.data).toLocaleDateString()}</TableCell>
                      {/* <TableCell>{alerta.read ? 'Sim' : 'Não'}</TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Alertas; 