import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlertas = async () => {
      try {
        setLoading(true);
        console.log('Iniciando busca de alertas...');
        
        const response = await axios.get('http://localhost:3001/api/alertas-ia', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        console.log('Resposta da API:', response.data);
        setAlertas(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Erro detalhado ao buscar alertas:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Erro desconhecido';
        setError(`Não foi possível carregar os alertas: ${errorMessage}`);
        toast({
          variant: "destructive",
          title: "Erro ao carregar alertas",
          description: errorMessage
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAlertas();
  }, [toast]);

  return (
    <Layout>
      <Card>
        <CardHeader>
          <CardTitle>Alertas do Sistema</CardTitle>
          <CardDescription>Visualize e gerencie os alertas gerados pelo sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <p>Carregando alertas...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && alertas.length === 0 && <p>Nenhum alerta encontrado.</p>}
          {!loading && !error && alertas.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Mensagem</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alertas.map(alerta => (
                    <TableRow key={alerta.id}>
                      <TableCell className="font-medium">{alerta.tipo}</TableCell>
                      <TableCell>{alerta.mensagem}</TableCell>
                      <TableCell>{new Date(alerta.data).toLocaleDateString()}</TableCell>
                      <TableCell>{alerta.read ? 'Lido' : 'Não lido'}</TableCell>
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