
import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Bell, Search, User } from 'lucide-react';

interface TopbarProps {
  pageName: string;
  toggleMobileMenu: () => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ pageName, toggleMobileMenu, toggleTheme, isDarkMode }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

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

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        (event.target as HTMLElement).id !== 'search-button'
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <div className={`${isDarkMode ? 'bg-dark-200 border-dark-400' : 'bg-white border-gray-100'} shadow-sm p-4 flex justify-between items-center sticky top-0 z-10 border-b`}>
      <div className="flex items-center">
        <button
          onClick={toggleMobileMenu}
          className={`md:hidden ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'} mr-4 focus:outline-none`}
          aria-label="Open menu"
        >
          <i className="fas fa-bars text-xl"></i>
        </button>
        <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{pageName}</h1>
      </div>

      <div className="flex items-center space-x-3">
        {/* Search */}
        <div className="relative" ref={searchRef}>
          <button 
            id="search-button"
            onClick={toggleSearch}
            className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-dark-300' : 'hover:bg-gray-100'} focus:outline-none`}
          >
            <Search className={`h-5 w-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>

          {isSearchOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-200 rounded-lg shadow-lg py-2 z-20 animate-fade-in border border-gray-100 dark:border-dark-400">
              <div className="p-2">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                      isDarkMode 
                        ? 'bg-dark-300 border-dark-400 text-white placeholder:text-gray-400' 
                        : 'bg-gray-100 border-gray-200 text-gray-800'
                    } focus:outline-none focus:ring-1 focus:ring-primary-500`} 
                    autoFocus 
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme} 
          className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-dark-300' : 'hover:bg-gray-100'} focus:outline-none`}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600" />
          )}
        </button>
        
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={toggleNotifications}
            className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-dark-300' : 'hover:bg-gray-100'} focus:outline-none relative`}
            aria-label="Notifications"
          >
            <Bell className={`h-5 w-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          {notificationsOpen && (
            <div className={`absolute right-0 mt-2 w-72 ${
              isDarkMode ? 'bg-dark-200 border-dark-400' : 'bg-white border-gray-100'
            } rounded-lg shadow-lg py-1 z-20 animate-slide-down border`}>
              <div className={`px-4 py-2 border-b ${isDarkMode ? 'border-dark-400' : 'border-gray-100'}`}>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Notificações</p>
              </div>
              <a
                href="#"
                className={`block px-4 py-2 text-sm ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-dark-300' 
                    : 'text-gray-700 hover:bg-gray-50'
                } transition-colors`}
              >
                Novo usuário solicitou acesso
              </a>
              <a
                href="#"
                className={`block px-4 py-2 text-sm ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-dark-300' 
                    : 'text-gray-700 hover:bg-gray-50'
                } transition-colors`}
              >
                Evento "Mixagem Avançada" amanhã
              </a>
              <a
                href="#"
                className={`block px-4 py-2 text-sm ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-dark-300' 
                    : 'text-gray-700 hover:bg-gray-50'
                } transition-colors`}
              >
                2 novos membros na equipe
              </a>
              <div className={`border-t ${isDarkMode ? 'border-dark-400' : 'border-gray-100'} px-4 py-2`}>
                <a
                  href="#"
                  className="text-sm text-primary-600 hover:text-primary-800 transition-colors"
                >
                  Ver todas
                </a>
              </div>
            </div>
          )}
        </div>
        
        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={toggleProfile}
            className={`flex items-center space-x-2 focus:outline-none ${isDarkMode ? 'text-white' : 'text-gray-700'}`}
            aria-label="User profile"
          >
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              isDarkMode ? 'bg-dark-300' : 'bg-primary-100'
            }`}>
              <User className={`h-4 w-4 ${isDarkMode ? 'text-gray-300' : 'text-primary-600'}`} />
            </div>
            <span className="hidden md:inline">Admin</span>
          </button>
          {profileOpen && (
            <div className={`absolute right-0 mt-2 w-48 ${
              isDarkMode ? 'bg-dark-200 border-dark-400' : 'bg-white border-gray-100'
            } rounded-lg shadow-lg py-1 z-20 animate-slide-down border`}>
              <a
                href="#"
                className={`block px-4 py-2 text-sm ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-dark-300' 
                    : 'text-gray-700 hover:bg-gray-50'
                } transition-colors`}
              >
                Perfil
              </a>
              <a
                href="#"
                className={`block px-4 py-2 text-sm ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-dark-300' 
                    : 'text-gray-700 hover:bg-gray-50'
                } transition-colors`}
              >
                Configurações
              </a>
              <div className={`border-t ${isDarkMode ? 'border-dark-400' : 'border-gray-100'}`}>
                <a
                  href="#"
                  className={`block px-4 py-2 text-sm ${
                    isDarkMode 
                      ? 'text-gray-300 hover:bg-dark-300' 
                      : 'text-gray-700 hover:bg-gray-50'
                  } transition-colors`}
                >
                  Sair
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
