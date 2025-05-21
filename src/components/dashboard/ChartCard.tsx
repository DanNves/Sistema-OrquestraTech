
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
    <div className="bg-[#131b2e] rounded-lg shadow p-4 md:p-6 transition-all duration-300 card-hover border border-[#1f2b45]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <select className="bg-[#1a223f] border border-[#1f2b45] rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 text-white">
          {periods.map((period) => (
            <option key={period}>{period}</option>
          ))}
        </select>
      </div>
      <div className="h-64">
        {children || (
          <div className="w-full h-full bg-[#1a223f]/50 rounded-lg flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-chart-line text-blue-400 text-2xl"></i>
            </div>
            <p className="text-gray-300 font-medium">Gráfico de eventos</p>
            <p className="text-sm text-gray-400 mt-1">Dados serão exibidos aqui</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartCard;
