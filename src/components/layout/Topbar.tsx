
import React, { useState, useEffect, useRef } from 'react';
import { Bell, User, Moon, Sun, Search } from 'lucide-react';

interface TopbarProps {
  pageName: string;
  toggleMobileMenu: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ pageName, toggleMobileMenu }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
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
    // Check for user preference in localStorage or system preference
    const userPrefersDark = localStorage.getItem('darkMode') === 'true' || 
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (userPrefersDark) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
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
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
      setIsDarkMode(true);
    }
  };

  return (
    <div className="bg-background border-b border-border shadow-sm p-4 flex justify-between items-center sticky top-0 z-10 transition-colors duration-300">
      <div className="flex items-center">
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-foreground hover:text-primary/80 mr-4 focus:outline-none transition-colors"
          aria-label="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-foreground">{pageName}</h1>
      </div>
      
      <div className="relative flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <input 
            type="text"
            placeholder="Buscar..." 
            className="w-full bg-background border border-input rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none transition-colors"
          aria-label={isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={toggleNotifications}
            className="p-2 rounded-full text-foreground hover:bg-accent hover:text-accent-foreground relative focus:outline-none transition-colors"
            aria-label="Notificações"
          >
            <Bell size={20} />
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-popover rounded-lg shadow-lg py-2 z-20 animate-in fade-in slide-in duration-200 border border-border">
              <div className="px-4 py-2 border-b border-border">
                <p className="font-medium text-popover-foreground">Notificações</p>
              </div>
              <a
                href="#"
                className="block px-4 py-3 text-sm hover:bg-accent transition-colors border-l-2 border-transparent hover:border-primary"
              >
                <p className="font-medium text-foreground">Novo usuário solicitou acesso</p>
                <p className="text-xs text-muted-foreground mt-1">Há 5 minutos</p>
              </a>
              <a
                href="#"
                className="block px-4 py-3 text-sm hover:bg-accent transition-colors border-l-2 border-transparent hover:border-primary"
              >
                <p className="font-medium text-foreground">Evento "Mixagem Avançada" amanhã</p>
                <p className="text-xs text-muted-foreground mt-1">Às 14:00</p>
              </a>
              <a
                href="#"
                className="block px-4 py-3 text-sm hover:bg-accent transition-colors border-l-2 border-transparent hover:border-primary"
              >
                <p className="font-medium text-foreground">2 novos membros na equipe</p>
                <p className="text-xs text-muted-foreground mt-1">Há 2 horas</p>
              </a>
              <div className="border-t border-border px-4 py-2 text-center">
                <a
                  href="#"
                  className="text-sm text-primary hover:underline transition-colors"
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
            className="flex items-center space-x-2 p-2 rounded-full hover:bg-accent focus:outline-none transition-colors"
            aria-label="User profile"
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User size={18} className="text-primary" />
            </div>
            <span className="hidden md:inline text-foreground font-medium text-sm">Admin</span>
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-popover rounded-lg shadow-lg py-2 z-20 animate-in fade-in slide-in duration-200 border border-border">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-medium text-foreground">Admin</p>
                <p className="text-xs text-muted-foreground mt-1">admin@musictech.com</p>
              </div>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
              >
                Perfil
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
              >
                Configurações
              </a>
              <div className="border-t border-border">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
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
