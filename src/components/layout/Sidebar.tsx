
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  UserPlus, 
  Settings,
  Music
} from 'lucide-react';

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
    { name: 'Dashboard', icon: LayoutDashboard, path: '/', notificationCount: 0 },
    { name: 'Equipes', icon: Users, path: '/equipes', notificationCount: 0 },
    { name: 'Eventos', icon: CalendarDays, path: '/eventos', notificationCount: 0 },
    { name: 'Usuários', icon: UserPlus, path: '/usuarios', notificationCount: 3 },
    { name: 'Configurações', icon: Settings, path: '/configuracoes', notificationCount: 0 },
  ];

  return (
    <div
      className={`bg-[#131b2e] shadow-soft w-64 fixed h-full transition-all duration-300 z-50 ${
        isCollapsed ? 'sidebar-collapsed' : ''
      } ${isMobileOpen ? 'sidebar-mobile-open' : 'sidebar-mobile'}`}
    >
      <div className="p-5 flex items-center justify-between border-b border-[#1f2b45]">
        <div className="flex items-center">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Music className="text-white h-5 w-5 logo-icon" />
          </div>
          <span className="logo-text text-lg font-semibold ml-3 text-white">MusicTech</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white focus:outline-none"
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="user-info p-5 border-b border-[#1f2b45] flex items-center">
        <div className="h-10 w-10 rounded-full bg-blue-800/30 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div className="ml-3">
          <p className="font-medium text-white">Admin</p>
          <p className="user-role text-xs text-gray-400">Administrador</p>
        </div>
      </div>

      <div className="p-5">
        <div className="text-xs uppercase font-medium text-gray-400 mb-3">Menu</div>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`nav-item flex items-center p-3 text-gray-300 rounded-lg hover:bg-[#1a223f] transition-colors ${
                  currentPage === item.name ? 'active-nav' : ''
                }`}
                onClick={() => onPageChange(item.name)}
              >
                <item.icon className="h-5 w-5 text-gray-400" />
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
