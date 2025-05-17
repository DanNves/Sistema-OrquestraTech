
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
        <div className="h-24 w-24 mx-auto bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
          <i className="fas fa-exclamation-triangle text-4xl"></i>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-6">Página não encontrada</p>
        <p className="text-gray-500 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          <i className="fas fa-home mr-2"></i>
          Voltar ao Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
