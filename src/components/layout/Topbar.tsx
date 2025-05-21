
import React, { useState, useEffect, useRef } from 'react';
import { Bell, Sun, Moon, ChevronDown, Search, User, Settings } from 'lucide-react';

interface TopbarProps {
  pageName: string;
  toggleMobileMenu: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ pageName, toggleMobileMenu }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
      
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Set dark mode by default
    setIsDarkMode(true);
    document.documentElement.classList.add('dark');
    
    // Store preference
    localStorage.setItem('darkMode', 'true');
  }, []);

  const toggleNotifications = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotificationsOpen(!notificationsOpen);
    setProfileOpen(false);
  };

  const toggleProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProfileOpen(!profileOpen);
    setNotificationsOpen(false);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="bg-[#131b2e] shadow-soft p-4 flex justify-between items-center sticky top-0 z-10 border-b border-[#1f2b45]">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-gray-400 hover:text-white focus:outline-none"
          aria-label="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <h1 className="text-xl font-medium text-white">{pageName}</h1>
      </div>
      
      <div className="hidden md:flex relative mx-auto max-w-md w-full px-4">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-500" />
          </div>
          <input
            type="text"
            className="bg-[#1a223f] border border-[#1f2b45] text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
            placeholder="Search..."
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a223f] focus:outline-none"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
        
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={toggleNotifications}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a223f] relative focus:outline-none"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#131b2e] rounded-lg shadow-elevated py-1 z-20 animate-slide-down border border-[#1f2b45]">
              <div className="px-4 py-3 border-b border-[#1f2b45]">
                <p className="font-medium text-white">Notificações</p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <a
                  href="#"
                  className="block px-4 py-3 text-sm text-gray-300 hover:bg-[#1a223f] transition-colors border-b border-[#1f2b45]"
                >
                  <p className="font-medium">Novo usuário solicitou acesso</p>
                  <p className="text-xs text-gray-400 mt-1">5 minutos atrás</p>
                </a>
                <a
                  href="#"
                  className="block px-4 py-3 text-sm text-gray-300 hover:bg-[#1a223f] transition-colors border-b border-[#1f2b45]"
                >
                  <p className="font-medium">Novo evento criado</p>
                  <p className="text-xs text-gray-400 mt-1">2 horas atrás</p>
                </a>
                <a
                  href="#"
                  className="block px-4 py-3 text-sm text-gray-300 hover:bg-[#1a223f] transition-colors"
                >
                  <p className="font-medium">2 novos membros na equipe</p>
                  <p className="text-xs text-gray-400 mt-1">Ontem às 16:45</p>
                </a>
              </div>
              <div className="border-t border-[#1f2b45] px-4 py-3">
                <a
                  href="#"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  Ver todas
                </a>
              </div>
            </div>
          )}
        </div>
        
        <div className="relative" ref={profileRef}>
          <button
            onClick={toggleProfile}
            className="flex items-center gap-2 p-2 rounded-lg text-gray-300 hover:bg-[#1a223f] focus:outline-none"
            aria-label="User profile"
          >
            <div className="h-8 w-8 rounded-full bg-blue-800/30 flex items-center justify-center">
              <User className="h-4 w-4 text-blue-400" />
            </div>
            <span className="hidden md:inline font-medium">Admin</span>
            <ChevronDown className="hidden md:inline h-4 w-4" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#131b2e] rounded-lg shadow-elevated py-1 z-20 animate-slide-down border border-[#1f2b45]">
              <div className="px-4 py-3 border-b border-[#1f2b45]">
                <p className="font-medium text-white">Admin</p>
                <p className="text-xs text-gray-400">admin@musictech.com</p>
              </div>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#1a223f] transition-colors"
              >
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Perfil
                </div>
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#1a223f] transition-colors"
              >
                <div className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </div>
              </a>
              <div className="border-t border-[#1f2b45]">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-red-400 hover:bg-[#1a223f] transition-colors"
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Sair
                  </div>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
