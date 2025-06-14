import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import StatCard from '../components/dashboard/StatCard';
import ActivityItem from '../components/dashboard/ActivityItem';
import EventTable from '../components/dashboard/EventTable';
import ActionButton from '../components/dashboard/ActionButton';
import EventCalendar from '../components/dashboard/EventCalendar';
import { Plus, Users, Clock, BarChart3 } from 'lucide-react';
import axios from 'axios';

export function Dashboard() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [equipes, setEquipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para normalizar dados
  const normalizarDados = (dados, tipo) => {
    if (!Array.isArray(dados)) {
      console.warn(`Dados de ${tipo} não são um array:`, dados);
      return [];
    }
    return dados;
  };

  // Função para normalizar evento
  const normalizarEvento = (evento) => {
    console.log('Normalizando evento:', evento);
    return {
      ...evento,
      id: evento.id || evento._id,
      nome: evento.nome || evento.name || 'Sem nome',
      tipo: evento.tipo || 'Não especificado',
      status: evento.status || 'Pendente',
      equipesparticipantes: Array.isArray(evento.equipesparticipantes) ? evento.equipesparticipantes : 
                          Array.isArray(evento.equipesParticipantes) ? evento.equipesParticipantes : [],
      participantes: Array.isArray(evento.participantes) ? evento.participantes : [],
      data: evento.data || null,
      horainicio: evento.horainicio || null,
      local: evento.local || 'Não especificado'
    };
  };

  // Função para normalizar equipe
  const normalizarEquipe = (equipe) => {
    console.log('Normalizando equipe:', equipe);
    return {
      ...equipe,
      id: equipe.id || equipe._id,
      nome: equipe.nome || 'Sem nome',
      integrantes: Array.isArray(equipe.integrantes) ? equipe.integrantes : 
                  Array.isArray(equipe.membros) ? equipe.membros : []
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [eventsRes, usersRes, equipesRes] = await Promise.all([
          axios.get('http://localhost:3001/api/eventos'),
          axios.get('http://localhost:3001/api/usuarios'),
          axios.get('http://localhost:3001/api/equipes'),
        ]);

        // Log para debug
        console.log('Dados brutos da API:', {
          eventos: eventsRes.data,
          equipes: equipesRes.data,
          usuarios: usersRes.data
        });

        // Normalizar dados
        const eventosNormalizados = normalizarDados(eventsRes.data, 'eventos').map(normalizarEvento);
        const equipesNormalizadas = normalizarDados(equipesRes.data, 'equipes').map(normalizarEquipe);
        const usuariosNormalizados = normalizarDados(usersRes.data, 'usuarios');

        // Log dos dados normalizados
        console.log('Dados normalizados:', {
          eventos: eventosNormalizados,
          equipes: equipesNormalizadas,
          usuarios: usuariosNormalizados
        });

        setEvents(eventosNormalizados);
        setUsers(usuariosNormalizados);
        setEquipes(equipesNormalizadas);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError('Erro ao carregar dados. Por favor, tente novamente.');
        setEvents([]);
        setUsers([]);
        setEquipes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Função auxiliar para contar participantes
  const contarParticipantes = (evento) => {
    let total = 0;
    
    // Log para debug
    console.log('Contando participantes para evento:', evento.nome);
    console.log('Equipes participantes:', evento.equipesparticipantes);
    
    // Contar membros das equipes participantes
    if (Array.isArray(evento.equipesparticipantes) && evento.equipesparticipantes.length > 0) {
      evento.equipesparticipantes.forEach(eqId => {
        const equipe = equipes.find(e => e.id === eqId || e._id === eqId);
        if (equipe && Array.isArray(equipe.integrantes)) {
          console.log(`Equipe ${equipe.nome} tem ${equipe.integrantes.length} integrantes`);
          total += equipe.integrantes.length;
        } else {
          console.warn(`Equipe não encontrada ou sem integrantes: ${eqId}`);
        }
      });
    }
    
    // Contar membros da equipe principal
    if (evento.equipeId) {
      const equipe = equipes.find(e => e.id === evento.equipeId || e._id === evento.equipeId);
      if (equipe && Array.isArray(equipe.integrantes)) {
        console.log(`Equipe principal ${equipe.nome} tem ${equipe.integrantes.length} integrantes`);
        total += equipe.integrantes.length;
      } else {
        console.warn(`Equipe principal não encontrada ou sem integrantes: ${evento.equipeId}`);
      }
    }
    
    // Contar participantes diretos
    if (Array.isArray(evento.participantes)) {
      console.log(`Evento tem ${evento.participantes.length} participantes diretos`);
      total += evento.participantes.length;
    }
    
    console.log(`Total de participantes para ${evento.nome}: ${total}`);
    return total;
  };

  // Cards de resumo com dados reais
  const statCards = [
    {
      icon: 'fa-calendar-alt',
      iconBgColor: 'bg-primary-100',
      iconColor: 'text-primary-600',
      title: 'Eventos Ativos',
      value: events.filter(e => e.status === 'Confirmado' || e.status === 'Em Andamento').length,
      footer: {
        text: events.length === 0 ? 'Nenhum evento' : `${events.filter(e => e.status === 'Confirmado' || e.status === 'Em Andamento').length} ativos`,
        icon: 'fa-arrow-up',
        color: events.length === 0 ? 'text-gray-400' : 'text-green-500',
      },
    },
    {
      icon: 'fa-users',
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      title: 'Equipes',
      value: equipes.length,
      footer: {
        text: equipes.length === 0 ? 'Nenhuma equipe' : `${equipes.length} equipes`,
        icon: 'fa-info-circle',
        color: equipes.length === 0 ? 'text-gray-400' : 'text-green-500',
      },
    },
    {
      icon: 'fa-user-check',
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Usuários Ativos',
      value: users.filter(u => (u.status && ["Ativo", "ativo", "active"].includes(u.status)) || u.ativo === true).length,
      footer: {
        text: users.length === 0 ? 'Nenhum usuário' : `${users.filter(u => (u.status && ["Ativo", "ativo", "active"].includes(u.status)) || u.ativo === true).length} ativos`,
        icon: 'fa-arrow-up',
        color: users.length === 0 ? 'text-gray-400' : 'text-green-500',
      },
    },
    {
      icon: 'fa-user-clock',
      iconBgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      title: 'Solicitações',
      value: 0,
      footer: {
        text: 'Nenhuma solicitação',
        icon: 'fa-clock',
        color: 'text-gray-400',
      },
    },
  ];

  const quickActions = [
    {
      text: 'Criar Novo Evento',
      icon: Plus,
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-600',
      ringColor: 'focus:ring-primary-500',
      action: 'navigate' as const,
      destination: '/eventos',
    },
    {
      text: 'Adicionar Equipe',
      icon: Users,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      ringColor: 'focus:ring-green-500',
      action: 'navigate' as const,
      destination: '/equipes',
    },
    {
      text: 'Ver Solicitações',
      icon: Clock,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      ringColor: 'focus:ring-blue-500',
      action: 'navigate' as const,
      destination: '/usuarios',
    },
    {
      text: 'Relatórios',
      icon: BarChart3,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      ringColor: 'focus:ring-purple-500',
      action: 'toast' as const,
      message: 'Gerando relatórios...'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-2">
      <Layout>
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>

        {/* Calendar and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Calendar - Now takes 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
            <EventCalendar events={events} />
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-700">Atividade Recente</h2>
              <span className="text-sm text-gray-400 font-medium">Nenhuma atividade recente</span>
            </div>
            <div className="space-y-4 text-center text-gray-400">
              Nenhuma atividade encontrada.
            </div>
          </div>
        </div>

        {/* Eventos e Ações Rápidas lado a lado */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Card de Eventos */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Eventos</h2>
            {loading ? (
              <div className="text-center text-gray-400">Carregando...</div>
            ) : events.length === 0 ? (
              <div className="text-center text-gray-400">Nenhum evento cadastrado.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead>
                    <tr className="text-gray-500 border-b">
                      <th className="py-2 px-3 font-semibold">Tipo</th>
                      <th className="py-2 px-3 font-semibold">Evento</th>
                      <th className="py-2 px-3 font-semibold">Equipe</th>
                      <th className="py-2 px-3 font-semibold">Data/Hora</th>
                      <th className="py-2 px-3 font-semibold">Local</th>
                      <th className="py-2 px-3 font-semibold">Participantes</th>
                      <th className="py-2 px-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((ev, idx) => (
                      <tr key={ev.id || idx} className="border-b hover:bg-blue-50 transition">
                        <td className="py-2 px-3">
                          {ev.tipo ? (
                            <span className="px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">{ev.tipo}</span>
                          ) : '-'}
                        </td>
                        <td className="py-2 px-3 font-medium text-gray-800">{ev.nome || ev.name}</td>
                        <td className="py-2 px-3 text-xs text-gray-700">
                          {Array.isArray(ev.equipesparticipantes) && ev.equipesparticipantes.length > 0
                            ? `${ev.equipesparticipantes.length} equipe${ev.equipesparticipantes.length > 1 ? 's' : ''}`
                            : ev.equipeId
                              ? '1 equipe'
                              : '-'}
                        </td>
                        <td className="py-2 px-3 text-xs text-gray-700">
                          {ev.data && ev.horainicio
                            ? `${new Date(ev.data).toLocaleDateString('pt-BR')} ${ev.horainicio.slice(0,5)}`
                            : ev.data
                              ? new Date(ev.data).toLocaleDateString('pt-BR')
                              : '-'}
                        </td>
                        <td className="py-2 px-3 text-xs text-gray-700">{ev.local || '-'}</td>
                        <td className="py-2 px-3 text-xs text-gray-700 flex items-center gap-1">
                          <span role="img" aria-label="participantes" className="inline-block">👥</span>
                          {(() => {
                            const total = contarParticipantes(ev);
                            return total > 0 ? total : '-';
                          })()}
                        </td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${ev.status === 'Confirmado' || ev.status === 'Concluído' ? 'bg-green-100 text-green-700' : ev.status === 'Pendente' ? 'bg-yellow-100 text-yellow-700' : ev.status === 'Cancelado' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{ev.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {/* Card de Ações Rápidas */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 flex flex-col justify-between">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-1 gap-4">
              {quickActions.map((action, index) => (
                <ActionButton key={index} {...action} />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
} 