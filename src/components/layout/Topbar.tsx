
import React, { useState, useEffect, useRef } from 'react';

interface TopbarProps {
  pageName: string;
  toggleMobileMenu: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ pageName, toggleMobileMenu }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
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

  return (
    <div className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center">
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-gray-500 hover:text-gray-700 mr-4 focus:outline-none"
          aria-label="Open menu"
        >
          <i className="fas fa-bars text-xl"></i>
        </button>
        <h1 className="text-xl font-bold text-gray-800">{pageName}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={toggleNotifications}
            className="text-gray-500 hover:text-gray-700 relative focus:outline-none"
            aria-label="Notifications"
          >
            <i className="fas fa-bell text-xl"></i>
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg py-1 z-20 animate-slide-down border border-gray-100">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="font-medium text-gray-800">Notificações</p>
              </div>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Novo usuário solicitou acesso
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Evento "Mixagem Avançada" amanhã
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                2 novos membros na equipe
              </a>
              <div className="border-t border-gray-100 px-4 py-2">
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
        <div className="relative" ref={profileRef}>
          <button
            onClick={toggleProfile}
            className="flex items-center space-x-2 focus:outline-none"
            aria-label="User profile"
          >
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
              <i className="fas fa-user text-primary-600"></i>
            </div>
            <span className="hidden md:inline text-gray-700">Admin</span>
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 animate-slide-down border border-gray-100">
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Perfil
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Configurações
              </a>
              <div className="border-t border-gray-100">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
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
