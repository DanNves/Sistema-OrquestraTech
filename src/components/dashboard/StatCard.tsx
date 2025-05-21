
import React from 'react';

interface StatCardProps {
  icon: string;
  iconBgColor: string;
  iconColor: string;
  title: string;
  value: string | number;
  footer: {
    text: string;
    icon: string;
    color: string;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  iconBgColor,
  iconColor,
  title,
  value,
  footer,
}) => {
  return (
    <div className="bg-[#131b2e] rounded-lg shadow p-4 md:p-6 transition-all duration-300 card-hover border border-[#1f2b45]">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${iconBgColor} ${iconColor}`}>
          <i className={`fas ${icon} text-xl`}></i>
        </div>
        <div className="ml-4">
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className={`text-xs ${footer.color} mt-1`}>
            <i className={`fas ${footer.icon} mr-1`}></i> {footer.text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
