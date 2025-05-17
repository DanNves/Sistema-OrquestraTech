
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('Dashboard');

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  };

  const handlePageChange = (pageName: string) => {
    setCurrentPage(pageName);
    if (isMobileMenuOpen) {
      setMobileMenuOpen(false);
      document.body.classList.remove('overflow-hidden');
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setMobileMenuOpen(false);
        document.body.classList.remove('overflow-hidden');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="flex min-h-screen overflow-hidden relative">
      {/* Mobile overlay */}
      <div
        className={`overlay ${isMobileMenuOpen ? 'overlay-visible' : ''}`}
        onClick={() => {
          setMobileMenuOpen(false);
          document.body.classList.remove('overflow-hidden');
        }}
      />

      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        isMobileOpen={isMobileMenuOpen}
        onPageChange={handlePageChange}
        currentPage={currentPage}
      />

      {/* Main content */}
      <div
        id="main-content"
        className={`flex-1 transition-all duration-300 ${
          isSidebarCollapsed ? 'content-expanded' : 'ml-64'
        } ${isMobileMenuOpen ? 'main-content-mobile' : ''} overflow-auto`}
      >
        <Topbar
          pageName={currentPage}
          toggleMobileMenu={toggleMobileMenu}
        />

        {/* Page content */}
        <div className="p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
