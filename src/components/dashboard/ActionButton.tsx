
import React from 'react';

interface ActionButtonProps {
  text: string;
  icon: string;
  bgColor: string;
  textColor: string;
  ringColor: string;
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  text,
  icon,
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
      <i className={`fas ${icon}`}></i>
    </button>
  );
};

export default ActionButton;
