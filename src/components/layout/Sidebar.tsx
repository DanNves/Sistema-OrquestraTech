import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  toggleSidebar,
  isMobileOpen,
}) => {
  const location = useLocation();
  const [isDashboardOpen, setIsDashboardOpen] = useState(location.pathname.startsWith('/relatorios/'));

  const navItems = [
    {
      title: 'Dashboard',
      icon: <i className="fas fa-chart-bar text-primary-600"></i>,
      path: '/dashboard',
      submenu: [
        { title: 'Relatório de Usuários', icon: <i className="fas fa-users text-blue-500"></i>, path: '/relatorios/usuarios' },
        { title: 'Relatório de Eventos', icon: <i className="fas fa-calendar-alt text-purple-500"></i>, path: '/relatorios/eventos' },
        { title: 'Estatísticas de Equipes', icon: <i className="fas fa-people-group text-green-500"></i>, path: '/relatorios/equipes' },
        { title: 'Relatório de Inscrições', icon: <i className="fas fa-clipboard-list text-yellow-500"></i>, path: '/relatorios/inscricoes' }
      ]
    },
    { title: 'Equipes', icon: <i className="fas fa-users text-green-600"></i>, path: '/equipes', notificationCount: 0 },
    { title: 'Eventos', icon: <i className="fas fa-calendar-alt text-purple-600"></i>, path: '/eventos', notificationCount: 0 },
    { title: 'Questionários', icon: <i className="fas fa-clipboard-question text-orange-500"></i>, path: '/questionarios', notificationCount: 0 },
    { title: 'Usuários', icon: <i className="fas fa-user text-blue-600"></i>, path: '/usuarios', notificationCount: 3 },
    { title: 'Alertas', icon: <i className="fas fa-bell text-red-600"></i>, path: '/alertas', notificationCount: 0 },
    { title: 'Configurações', icon: <i className="fas fa-cog text-gray-600"></i>, path: '/configuracoes', notificationCount: 0 },
  ];

  return (
    <div
      className={`bg-white shadow-lg w-64 fixed h-full transition-all duration-300 z-50 ${
        isCollapsed ? 'sidebar-collapsed' : ''
      } ${isMobileOpen ? 'sidebar-mobile-open' : 'sidebar-mobile'}`}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center">
          <div className="bg-primary-600 p-2 rounded-lg">
            <i className="fas fa-music text-white text-xl logo-icon"></i>
          </div>
          <span className="logo-text text-xl font-bold ml-3 text-gray-800">OrquestraTech</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Toggle sidebar"
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>

      <div className="user-info p-4 border-b border-gray-100 flex items-center">
        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
          <i className="fas fa-user text-primary-600"></i>
        </div>
        <div className="ml-3">
          <p className="font-medium text-gray-800">Admin</p>
          <p className="user-role text-xs text-gray-500">Administrador</p>
        </div>
      </div>

      <div className="p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <li key={item.title}>
                {item.submenu ? (
                  <div className="relative">
                    <Link
                      to={item.path}
                      className={cn(
                        'flex items-center w-full px-4 py-2 text-left hover:bg-gray-100',
                        (location.pathname === item.path || 
                         (item.title === 'Dashboard' && location.pathname.startsWith('/relatorios/'))) && 'bg-gray-100'
                      )}
                      onClick={() => {
                        if (item.title === 'Dashboard') setIsDashboardOpen(false);
                      }}
                    >
                      <div className="flex items-center flex-grow">
                        <span className="mr-2">{item.icon}</span>
                        <span>{item.title}</span>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        if (item.title === 'Dashboard') setIsDashboardOpen(!isDashboardOpen);
                      }}
                      className="absolute right-0 top-0 h-full px-4 flex items-center hover:bg-gray-200 rounded-r"
                      aria-label="Toggle submenu"
                    >
                      <ChevronDown className={cn('w-4 h-4 transition-transform', 
                        (item.title === 'Dashboard' && isDashboardOpen) ? 'transform rotate-180' : '')} 
                      />
                    </button>
                    {(item.title === 'Dashboard' && isDashboardOpen) && (
                      <div className="pl-8">
                        {item.submenu.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            to={subItem.path}
                            className={cn(
                              'flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded transition-colors hover:bg-blue-50',
                              location.pathname === subItem.path && 'bg-blue-100 text-primary-700'
                            )}
                            onClick={() => {
                              if (item.title === 'Dashboard') setIsDashboardOpen(true);
                            }}
                          >
                            <span className="mr-2">{subItem.icon}</span>
                            <span>{subItem.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`nav-item flex items-center p-3 text-gray-600 rounded-lg hover:bg-primary-50 transition-colors ${
                      isActive ? 'active-nav bg-blue-50 text-blue-700 font-semibold' : ''
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span className="nav-text ml-1 font-medium">{item.title}</span>
                    {item.notificationCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full ml-auto">
                        {item.notificationCount}
                      </span>
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
