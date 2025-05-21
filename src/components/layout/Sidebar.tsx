
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Users, Calendar, Cog, Music, ChevronRight } from 'lucide-react';

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
    { name: 'Dashboard', icon: <Music size={20} />, path: '/', notificationCount: 0 },
    { name: 'Equipes', icon: <Users size={20} />, path: '/equipes', notificationCount: 0 },
    { name: 'Eventos', icon: <Calendar size={20} />, path: '/eventos', notificationCount: 0 },
    { name: 'Usuários', icon: <User size={20} />, path: '/usuarios', notificationCount: 3 },
    { name: 'Configurações', icon: <Cog size={20} />, path: '/configuracoes', notificationCount: 0 },
  ];

  return (
    <div
      className={`bg-sidebar text-sidebar-foreground shadow-lg w-64 fixed h-full transition-all duration-300 z-50 ${
        isCollapsed ? 'sidebar-collapsed' : ''
      } ${isMobileOpen ? 'sidebar-mobile-open' : 'sidebar-mobile'}`}
    >
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-2 rounded-lg">
            <Music className="text-white text-xl" />
          </div>
          <span className="logo-text text-xl font-bold ml-3 text-sidebar-foreground">MusicTech</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="text-sidebar-foreground hover:text-sidebar-accent-foreground focus:outline-none transition-colors"
          aria-label="Toggle sidebar"
        >
          <ChevronRight 
            size={20} 
            className={`transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <div className="user-info p-4 border-b border-sidebar-border flex items-center">
        <div className="h-10 w-10 rounded-full bg-sidebar-accent flex items-center justify-center">
          <User size={20} className="text-sidebar-primary" />
        </div>
        <div className="ml-3">
          <p className="font-medium text-sidebar-foreground">Admin</p>
          <p className="user-role text-xs text-sidebar-foreground/70">Administrador</p>
        </div>
      </div>

      <div className="p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name} className="overflow-hidden">
              <Link
                to={item.path}
                className={`nav-item flex items-center p-3 text-sidebar-foreground rounded-lg hover:bg-sidebar-accent transition-all duration-200 ${
                  currentPage === item.name ? 'active-nav' : ''
                }`}
                onClick={() => onPageChange(item.name)}
              >
                <span className="text-sidebar-foreground/70 w-5 text-center group-hover:text-sidebar-accent-foreground">
                  {item.icon}
                </span>
                <span className="nav-text ml-3 font-medium">{item.name}</span>
                {item.notificationCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full ml-auto animate-pulse">
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
