
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  text: string;
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
  ringColor: string;
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  text,
  icon: Icon,
  bgColor,
  textColor,
  ringColor,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 ${bgColor} ${textColor} rounded-lg hover:bg-opacity-80 transition-colors focus:outline-none focus:ring-2 ${ringColor} focus:ring-opacity-50`}
    >
      <span className="font-medium">{text}</span>
      <Icon className="h-5 w-5" />
    </button>
  );
};

export default ActionButton;
