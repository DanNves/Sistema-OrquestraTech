
import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileOpen: boolean;
  onPageChange: (pageName: string) => void;
  currentPage: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  toggleSidebar,
  isMobileOpen,
  onPageChange,
  currentPage,
}) => {
  const navItems = [
    { name: 'Dashboard', icon: 'fa-tachometer-alt', path: '/', notificationCount: 0 },
    { name: 'Equipes', icon: 'fa-users', path: '/equipes', notificationCount: 0 },
    { name: 'Eventos', icon: 'fa-calendar-alt', path: '/eventos', notificationCount: 0 },
    { name: 'Usuários', icon: 'fa-user-plus', path: '/usuarios', notificationCount: 3 },
    { name: 'Configurações', icon: 'fa-cog', path: '/configuracoes', notificationCount: 0 },
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
          <span className="logo-text text-xl font-bold ml-3 text-gray-800">MusicTech</span>
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
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`nav-item flex items-center p-3 text-gray-600 rounded-lg hover:bg-primary-50 transition-colors ${
                  currentPage === item.name ? 'active-nav' : ''
                }`}
                onClick={() => onPageChange(item.name)}
              >
                <i className={`fas ${item.icon} text-gray-500 w-5 text-center`}></i>
                <span className="nav-text ml-3 font-medium">{item.name}</span>
                {item.notificationCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full ml-auto">
                    {item.notificationCount}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
