
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ActionButtonProps {
  text: string;
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
  ringColor: string;
  action?: 'navigate' | 'toast' | 'dialog';
  destination?: string;
  message?: string;
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  text,
  icon: Icon,
  bgColor,
  textColor,
  ringColor,
  action = 'toast',
  destination = '/',
  message = 'Esta funcionalidade será implementada em breve.',
  onClick,
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    
    switch (action) {
      case 'navigate':
        navigate(destination);
        break;
      case 'toast':
        toast.info(message || `Ação: ${text}`);
        break;
      case 'dialog':
        // This could open a dialog in the future
        toast.info('Esta ação abrirá um diálogo em breve.');
        break;
      default:
        toast.info('Ação não definida');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center justify-between p-3 ${bgColor.replace('bg-primary-50', 'bg-primary-500/10').replace('bg-green-50', 'bg-green-500/10').replace('bg-blue-50', 'bg-blue-500/10').replace('bg-purple-50', 'bg-purple-500/10')} ${textColor} rounded-lg hover:bg-opacity-80 transition-colors focus:outline-none focus:ring-2 ${ringColor} focus:ring-opacity-50`}
    >
      <span className="font-medium">{text}</span>
      <Icon className="h-5 w-5" />
    </button>
  );
};

export default ActionButton;
