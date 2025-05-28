import React from 'react';
import Layout from '../components/layout/Layout';
import StatCard from '../components/dashboard/StatCard';
import ActivityItem from '../components/dashboard/ActivityItem';
import EventTable from '../components/dashboard/EventTable';
import ActionButton from '../components/dashboard/ActionButton';
import EventCalendar from '../components/dashboard/EventCalendar';
import { Plus, Users, Clock, BarChart3 } from 'lucide-react';

const Index = () => {
  const statCards = [
    {
      icon: 'fa-calendar-alt',
      iconBgColor: 'bg-primary-100',
      iconColor: 'text-primary-600',
      title: 'Eventos Ativos',
      value: 12,
      footer: {
        text: '2 novos esta semana',
        icon: 'fa-arrow-up',
        color: 'text-green-500',
      },
    },
    {
      icon: 'fa-users',
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      title: 'Equipes',
      value: 8,
      footer: {
        text: '3 equipes ativas',
        icon: 'fa-info-circle',
        color: 'text-primary-500',
      },
    },
    {
      icon: 'fa-user-check',
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Usuários Ativos',
      value: 42,
      footer: {
        text: '5% este mês',
        icon: 'fa-arrow-up',
        color: 'text-green-500',
      },
    },
    {
      icon: 'fa-user-clock',
      iconBgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      title: 'Solicitações',
      value: 3,
      footer: {
        text: 'Necessita atenção',
        icon: 'fa-clock',
        color: 'text-red-500',
      },
    },
  ];

  const activities = [
    {
      icon: 'fa-user-plus',
      iconBgColor: 'bg-primary-100',
      iconColor: 'text-primary-600',
      title: 'Novo usuário registrado',
      description: 'João Silva solicitou acesso',
      timeAgo: '10 minutos atrás',
    },
    {
      icon: 'fa-calendar-check',
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      title: 'Novo evento criado',
      description: 'Workshop de Mixagem',
      timeAgo: '2 horas atrás',
    },
    {
      icon: 'fa-users',
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Equipe atualizada',
      description: '2 novos membros na equipe de Sonorização',
      timeAgo: 'Ontem',
    },
    {
      icon: 'fa-check-circle',
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      title: 'Evento concluído',
      description: 'Curso de Produção Musical',
      timeAgo: '2 dias atrás',
    },
  ];

  const events = [
    {
      name: 'Workshop de Mixagem',
      date: '15/06/2023',
      team: 'Equipe de Áudio',
      status: {
        text: 'Confirmado',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
      },
    },
    {
      name: 'Curso de Produção',
      date: '20/06/2023',
      team: 'Equipe de Produção',
      status: {
        text: 'Pendente',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
      },
    },
    {
      name: 'Encontro Técnico',
      date: '25/06/2023',
      team: 'Equipe Técnica',
      status: {
        text: 'Em preparação',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
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
      action: 'navigate' as const, // Explicitly typing as const
      destination: '/eventos',
    },
    {
      text: 'Adicionar Equipe',
      icon: Users,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      ringColor: 'focus:ring-green-500',
      action: 'navigate' as const, // Explicitly typing as const
      destination: '/equipes',
    },
    {
      text: 'Ver Solicitações',
      icon: Clock,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      ringColor: 'focus:ring-blue-500',
      action: 'navigate' as const, // Changed from 'toast' to 'navigate'
      destination: '/usuarios', // Added destination to users page
    },
    {
      text: 'Relatórios',
      icon: BarChart3,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      ringColor: 'focus:ring-purple-500',
      action: 'toast' as const, // Explicitly typing as const
      message: 'Gerando relatórios...',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-2">
      <Layout>
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
            <EventCalendar />
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-700">Atividade Recente</h2>
              <a href="#" className="text-sm text-blue-500 hover:text-blue-700 font-medium">
                Ver tudo
              </a>
            </div>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Events and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Events */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-700">Próximos Eventos</h2>
              <a href="#" className="text-sm text-blue-500 hover:text-blue-700 font-medium">
                Ver todos
              </a>
            </div>
            <EventTable events={events} />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 flex flex-col">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Ações Rápidas</h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <ActionButton key={index} {...action} />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Index;
