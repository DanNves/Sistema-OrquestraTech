
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  UserPlus, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Music
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileOpen: boolean;
  onPageChange: (pageName: string) => void;
  currentPage: string;
  isDarkMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  toggleSidebar,
  isMobileOpen,
  onPageChange,
  currentPage,
  isDarkMode,
}) => {
  const navItems = [
    { 
      name: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/', 
      notificationCount: 0 
    },
    { 
      name: 'Equipes', 
      icon: Users, 
      path: '/equipes', 
      notificationCount: 0 
    },
    { 
      name: 'Eventos', 
      icon: Calendar, 
      path: '/eventos', 
      notificationCount: 0 
    },
    { 
      name: 'Usuários', 
      icon: UserPlus, 
      path: '/usuarios', 
      notificationCount: 3 
    },
    { 
      name: 'Configurações', 
      icon: Settings, 
      path: '/configuracoes', 
      notificationCount: 0 
    },
  ];

  return (
    <div
      className={`${isDarkMode ? 'bg-dark-200 border-dark-400' : 'bg-white border-gray-100'} shadow-lg w-64 fixed h-full transition-all duration-300 z-50 border-r ${
        isCollapsed ? 'sidebar-collapsed' : ''
      } ${isMobileOpen ? 'sidebar-mobile-open' : 'sidebar-mobile'}`}
    >
      <div className={`p-4 flex items-center justify-between ${isDarkMode ? 'border-dark-400' : 'border-gray-100'} border-b`}>
        <div className="flex items-center">
          <div className={`${isDarkMode ? 'bg-primary/30' : 'bg-primary-600'} p-2 rounded-lg`}>
            <Music className={`${isDarkMode ? 'text-primary' : 'text-white'} text-xl logo-icon`} />
          </div>
          <span className={`logo-text text-xl font-bold ml-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>MusicTech</span>
        </div>
        <button
          onClick={toggleSidebar}
          className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} focus:outline-none`}
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className={`user-info p-4 ${isDarkMode ? 'border-dark-400' : 'border-gray-100'} border-b flex items-center`}>
        <div className={`h-10 w-10 rounded-full ${isDarkMode ? 'bg-dark-300 text-primary' : 'bg-primary-100 text-primary-600'} flex items-center justify-center`}>
          <User className="h-5 w-5" />
        </div>
        <div className="ml-3">
          <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Admin</p>
          <p className={`user-role text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Administrador</p>
        </div>
      </div>

      <div className="p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`nav-item flex items-center p-3 rounded-lg transition-colors ${
                    currentPage === item.name 
                      ? 'active-nav' 
                      : `${isDarkMode ? 'text-gray-300 hover:bg-dark-300' : 'text-gray-600 hover:bg-primary-50'}`
                  }`}
                  onClick={() => onPageChange(item.name)}
                >
                  <IconComponent className={`h-5 w-5 ${
                    currentPage === item.name 
                      ? 'text-white' 
                      : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                  }`} />
                  <span className="nav-text ml-3 font-medium">{item.name}</span>
                  {item.notificationCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full ml-auto">
                      {item.notificationCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
