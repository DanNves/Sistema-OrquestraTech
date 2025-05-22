
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Settings, 
  Bell, 
  User, 
  Shield, 
  Database, 
  Palette, 
  Mail, 
  Share2, 
  HelpCircle
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface SettingCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const SettingCard: React.FC<SettingCardProps> = ({ title, description, icon, onClick }) => {
  return (
    <Card className="hover:border-primary/50 transition-all cursor-pointer card-hover" onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-gray-600">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

const Configuracoes = () => {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  
  // Estado para configurações do sistema
  const [generalSettings, setGeneralSettings] = useState({
    siteTitle: "MusicTech",
    siteDescription: "Sistema de gestão para eventos musicais",
    enableNotifications: true,
    darkMode: false,
    language: "pt-BR"
  });

  // Função para abrir um diálogo específico
  const openDialog = (dialogName: string) => {
    setActiveDialog(dialogName);
  };

  // Função para fechar o diálogo ativo
  const closeDialog = () => {
    setActiveDialog(null);
  };

  // Função para salvar configurações gerais
  const saveGeneralSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações gerais foram atualizadas com sucesso.",
    });
    closeDialog();
  };

  // Toggle para mudar switch
  const handleSwitchChange = (field: string) => {
    setGeneralSettings(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };

  // Manipulador para campos de input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Cards de configuração
  const settingsCards = [
    {
      title: "Configurações Gerais",
      description: "Ajuste o título, descrição e outros parâmetros gerais do sistema.",
      icon: <Settings className="h-6 w-6" />,
      dialog: "general"
    },
    {
      title: "Notificações",
      description: "Configure as preferências de notificações e alertas do sistema.",
      icon: <Bell className="h-6 w-6" />,
      dialog: "notifications"
    },
    {
      title: "Usuários & Permissões",
      description: "Gerencie níveis de acesso e permissões para usuários do sistema.",
      icon: <User className="h-6 w-6" />,
      dialog: "users"
    },
    {
      title: "Segurança",
      description: "Configure políticas de senha, autenticação em dois fatores e outras opções de segurança.",
      icon: <Shield className="h-6 w-6" />,
      dialog: "security"
    },
    {
      title: "Backup & Dados",
      description: "Configure opções de backup e gerencie dados do sistema.",
      icon: <Database className="h-6 w-6" />,
      dialog: "backup"
    },
    {
      title: "Aparência",
      description: "Personalize a aparência e o tema da interface do usuário.",
      icon: <Palette className="h-6 w-6" />,
      dialog: "appearance"
    },
    {
      title: "Email & Comunicação",
      description: "Configure servidores de email e modelos de comunicação.",
      icon: <Mail className="h-6 w-6" />,
      dialog: "email"
    },
    {
      title: "Integrações",
      description: "Conecte o sistema a aplicativos e serviços externos.",
      icon: <Share2 className="h-6 w-6" />,
      dialog: "integrations"
    },
    {
      title: "Suporte & Ajuda",
      description: "Acesse recursos de ajuda, tutoriais e suporte técnico.",
      icon: <HelpCircle className="h-6 w-6" />,
      dialog: "support"
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Configurações do Sistema</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {settingsCards.map((card) => (
              <SettingCard 
                key={card.title}
                title={card.title}
                description={card.description}
                icon={card.icon}
                onClick={() => openDialog(card.dialog)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Dialog de Configurações Gerais */}
      <Dialog open={activeDialog === "general"} onOpenChange={() => activeDialog === "general" && closeDialog()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Configurações Gerais</DialogTitle>
            <DialogDescription>
              Ajuste as configurações básicas do sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="siteTitle" className="text-sm font-medium">Título do Sistema</label>
              <Input
                id="siteTitle"
                name="siteTitle"
                value={generalSettings.siteTitle}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="siteDescription" className="text-sm font-medium">Descrição</label>
              <Textarea
                id="siteDescription"
                name="siteDescription"
                value={generalSettings.siteDescription}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label htmlFor="enableNotifications" className="text-sm font-medium">Ativar Notificações</label>
                <p className="text-xs text-gray-500">Receba alertas sobre eventos e atualizações</p>
              </div>
              <Switch
                id="enableNotifications"
                checked={generalSettings.enableNotifications}
                onCheckedChange={() => handleSwitchChange('enableNotifications')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label htmlFor="darkMode" className="text-sm font-medium">Modo Escuro</label>
                <p className="text-xs text-gray-500">Alterna entre modo claro e escuro</p>
              </div>
              <Switch
                id="darkMode"
                checked={generalSettings.darkMode}
                onCheckedChange={() => handleSwitchChange('darkMode')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancelar</Button>
            <Button onClick={saveGeneralSettings}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Notificações - Placeholder */}
      <Dialog open={activeDialog === "notifications"} onOpenChange={() => activeDialog === "notifications" && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurações de Notificações</DialogTitle>
            <DialogDescription>
              Gerencie suas preferências de notificações.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500">
              Esta funcionalidade será implementada em breve. Fique atento às atualizações!
            </p>
          </div>
          <DialogFooter>
            <Button onClick={closeDialog}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Outros Dialogs seguiriam um padrão similar */}
      {settingsCards.slice(2).map((card) => (
        <Dialog 
          key={card.dialog}
          open={activeDialog === card.dialog} 
          onOpenChange={() => activeDialog === card.dialog && closeDialog()}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{card.title}</DialogTitle>
              <DialogDescription>
                {card.description}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-500">
                Esta funcionalidade será implementada em breve. Fique atento às atualizações!
              </p>
            </div>
            <DialogFooter>
              <Button onClick={closeDialog}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </Layout>
  );
};

export default Configuracoes;
