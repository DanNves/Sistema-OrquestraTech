
import React from 'react';

interface ChartCardProps {
  title: string;
  children?: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => {
  const periods = [
    'Últimos 7 dias',
    'Últimos 30 dias',
    'Últimos 90 dias',
  ];
  
  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6 transition-all duration-300 card-hover">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <select className="border border-gray-200 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500">
          {periods.map((period) => (
            <option key={period}>{period}</option>
          ))}
        </select>
      </div>
      <div className="h-64">
        {children || (
          <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-25 rounded-lg flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-chart-line text-primary-600 text-2xl"></i>
            </div>
            <p className="text-gray-500 font-medium">Gráfico de eventos</p>
            <p className="text-sm text-gray-400 mt-1">Dados serão exibidos aqui</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartCard;
