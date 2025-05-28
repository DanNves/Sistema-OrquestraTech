import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { 
  Settings, 
  Bell, 
  Users, 
  Shield, 
  Database, 
  Palette, 
  Mail, 
  Link, 
  HelpCircle,
  Save,
  Download,
  Upload,
  MessageSquare,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "@/hooks/use-toast";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose
} from '@/components/ui/drawer';

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
  const [isPermissoesDrawerOpen, setPermissoesDrawerOpen] = useState(false);
  
  // Estado para configurações do sistema
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      frequency: 'realtime'
    },
    users: {
      defaultRole: 'user',
      requireApproval: true
    },
    security: {
      twoFactor: false,
      passwordPolicy: 'strong',
      sessionDuration: 30
    },
    backup: {
      frequency: 'daily',
      autoBackup: true
    },
    appearance: {
      theme: 'light',
      primaryColor: 'blue',
      compactMode: false
    },
    email: {
      smtpServer: '',
      smtpPort: 587,
      senderEmail: '',
      notifications: true
    },
    integrations: {
      googleCalendar: false,
      slack: false,
      microsoftTeams: false
    },
    support: {
      supportEmail: '',
      supportMessage: ''
    }
  });

  const defaultRoles = [
    {
      cargo: 'Administrador',
      permissoes: {
        usuarios: { ver: true, acessar: true, modificar: true },
        equipes: { ver: true, acessar: true, modificar: true },
        eventos: { ver: true, acessar: true, modificar: true },
        configuracoes: { ver: true, acessar: true, modificar: true },
      }
    },
    {
      cargo: 'Músico',
      permissoes: {
        usuarios: { ver: false, acessar: false, modificar: false },
        equipes: { ver: true, acessar: true, modificar: false },
        eventos: { ver: true, acessar: true, modificar: false },
        configuracoes: { ver: false, acessar: false, modificar: false },
      }
    },
    {
      cargo: 'Organista',
      permissoes: {
        usuarios: { ver: false, acessar: false, modificar: false },
        equipes: { ver: true, acessar: true, modificar: false },
        eventos: { ver: true, acessar: true, modificar: false },
        configuracoes: { ver: false, acessar: false, modificar: false },
      }
    },
    {
      cargo: 'Instrutor(a)',
      permissoes: {
        usuarios: { ver: false, acessar: false, modificar: false },
        equipes: { ver: true, acessar: true, modificar: false },
        eventos: { ver: true, acessar: true, modificar: false },
        configuracoes: { ver: false, acessar: false, modificar: false },
      }
    },
    {
      cargo: 'Candidato(a)',
      permissoes: {
        usuarios: { ver: false, acessar: false, modificar: false },
        equipes: { ver: true, acessar: false, modificar: false },
        eventos: { ver: true, acessar: false, modificar: false },
        configuracoes: { ver: false, acessar: false, modificar: false },
      }
    },
    {
      cargo: 'Encarregado Local',
      permissoes: {
        usuarios: { ver: true, acessar: true, modificar: false },
        equipes: { ver: true, acessar: true, modificar: true },
        eventos: { ver: true, acessar: true, modificar: true },
        configuracoes: { ver: false, acessar: false, modificar: false },
      }
    },
    {
      cargo: 'Encarregado Regional',
      permissoes: {
        usuarios: { ver: true, acessar: true, modificar: false },
        equipes: { ver: true, acessar: true, modificar: true },
        eventos: { ver: true, acessar: true, modificar: true },
        configuracoes: { ver: false, acessar: false, modificar: false },
      }
    },
    {
      cargo: 'Examinadora',
      permissoes: {
        usuarios: { ver: true, acessar: false, modificar: false },
        equipes: { ver: true, acessar: false, modificar: false },
        eventos: { ver: true, acessar: false, modificar: false },
        configuracoes: { ver: false, acessar: false, modificar: false },
      }
    },
  ];

  const [rolesPermissoes, setRolesPermissoes] = useState(defaultRoles);

  // Função para abrir um diálogo específico
  const openDialog = (dialogName: string) => {
    setActiveDialog(dialogName);
  };

  // Função para fechar o diálogo ativo
  const closeDialog = () => {
    setActiveDialog(null);
  };

  // Função para salvar configurações
  const saveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações foram atualizadas com sucesso.",
    });
    closeDialog();
  };

  // Cards de configuração
  const settingsCards = [
    {
      title: "Notificações",
      description: "Configure as preferências de notificações e alertas do sistema.",
      icon: <Bell className="h-6 w-6" />,
      dialog: "notifications"
    },
    {
      title: "Usuários & Permissões",
      description: "Gerencie níveis de acesso e permissões para usuários do sistema.",
      icon: <Users className="h-6 w-6" />,
      dialog: "users",
      onClick: () => setPermissoesDrawerOpen(true)
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
      description: "Personalize a aparência do sistema",
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
      description: "Conecte com outros serviços e plataformas",
      icon: <Link className="h-6 w-6" />,
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
            {/* Drawer apenas para Usuários & Permissões */}
            <Drawer open={isPermissoesDrawerOpen} onOpenChange={setPermissoesDrawerOpen}>
              <DrawerTrigger asChild>
                <div>
                  <SettingCard
                    title="Usuários & Permissões"
                    description="Gerencie níveis de acesso e permissões para usuários do sistema."
                    icon={<Users className="h-6 w-6" />}
                    onClick={() => setPermissoesDrawerOpen(true)}
                  />
                </div>
              </DrawerTrigger>
              <DrawerContent className="max-w-4xl w-full right-0 fixed top-0 h-full z-50 bg-background border-l flex flex-col">
                <DrawerHeader>
                  <DrawerTitle>Usuários e Permissões</DrawerTitle>
                  <DrawerDescription>
                    Gerencie permissões de acesso por cargo. Marque o que cada cargo pode ver, acessar e modificar.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="flex-1 flex flex-col">
                  <div className="overflow-auto max-h-[70vh] px-4 pb-4">
                    <table className="min-w-full border text-sm">
                      <thead>
                        <tr className="bg-muted">
                          <th className="p-2 border">Cargo</th>
                          <th className="p-2 border">Área</th>
                          <th className="p-2 border">Ver</th>
                          <th className="p-2 border">Acessar</th>
                          <th className="p-2 border">Modificar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rolesPermissoes.map((role, idx) => (
                          Object.keys(role.permissoes).map((area, i) => (
                            <tr key={role.cargo + area} className={i === 0 ? 'border-t-2' : ''}>
                              {i === 0 && (
                                <td className="p-2 border font-semibold" rowSpan={Object.keys(role.permissoes).length}>{role.cargo}</td>
                              )}
                              <td className="p-2 border">{area.charAt(0).toUpperCase() + area.slice(1)}</td>
                              <td className="p-2 border text-center">
                                <input type="checkbox" checked={role.permissoes[area].ver}
                                  onChange={e => {
                                    const updated = [...rolesPermissoes];
                                    updated[idx].permissoes[area].ver = e.target.checked;
                                    setRolesPermissoes(updated);
                                  }}
                                />
                              </td>
                              <td className="p-2 border text-center">
                                <input type="checkbox" checked={role.permissoes[area].acessar}
                                  onChange={e => {
                                    const updated = [...rolesPermissoes];
                                    updated[idx].permissoes[area].acessar = e.target.checked;
                                    setRolesPermissoes(updated);
                                  }}
                                />
                              </td>
                              <td className="p-2 border text-center">
                                <input type="checkbox" checked={role.permissoes[area].modificar}
                                  onChange={e => {
                                    const updated = [...rolesPermissoes];
                                    updated[idx].permissoes[area].modificar = e.target.checked;
                                    setRolesPermissoes(updated);
                                  }}
                                />
                              </td>
                            </tr>
                          ))
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <DrawerFooter className="flex flex-row gap-2 justify-end bg-background sticky bottom-0 z-10">
                  <DrawerClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DrawerClose>
                  <Button onClick={() => { saveSettings(); setPermissoesDrawerOpen(false); }}>Salvar Alterações</Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            {/* Demais cards normalmente */}
            {settingsCards.filter(card => card.dialog !== 'users').map((card) => (
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

        {/* Modal de Notificações */}
        <Dialog open={activeDialog === "notifications"} onOpenChange={() => activeDialog === "notifications" && closeDialog()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
              <DialogTitle>Configurações de Notificações</DialogTitle>
            <DialogDescription>
                Configure como e quando você recebe notificações
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Notificações por Email</Label>
                  <Switch 
                    id="email-notifications"
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, email: checked }
                    }))}
              />
            </div>
                <p className="text-sm text-muted-foreground">
                  Receba atualizações importantes por email
                </p>
              </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications">Notificações Push</Label>
                  <Switch 
                    id="push-notifications"
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, push: checked }
                    }))}
              />
            </div>
                <p className="text-sm text-muted-foreground">
                  Receba notificações em tempo real no navegador
                </p>
              </div>

              <div className="space-y-2">
                <Label>Frequência de Notificações</Label>
                <Select 
                  value={settings.notifications.frequency}
                  onValueChange={(value) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, frequency: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Tempo Real</SelectItem>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>Cancelar</Button>
              <Button onClick={saveSettings}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Segurança */}
        <Dialog open={activeDialog === "security"} onOpenChange={() => activeDialog === "security" && closeDialog()}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Configurações de Segurança</DialogTitle>
              <DialogDescription>
                Configure as opções de segurança do sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
            <div className="flex items-center justify-between">
                  <Label htmlFor="2fa">Autenticação em Duas Etapas</Label>
                  <Switch 
                    id="2fa"
                    checked={settings.security.twoFactor}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      security: { ...prev.security, twoFactor: checked }
                    }))}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Adicione uma camada extra de segurança
                </p>
              </div>

              <div className="space-y-2">
                <Label>Política de Senhas</Label>
                <Select 
                  value={settings.security.passwordPolicy}
                  onValueChange={(value) => setSettings(prev => ({
                    ...prev,
                    security: { ...prev.security, passwordPolicy: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a política" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Básica</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="strong">Forte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Duração da Sessão (minutos)</Label>
                <Input 
                  type="number" 
                  value={settings.security.sessionDuration}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    security: { ...prev.security, sessionDuration: parseInt(e.target.value) }
                  }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancelar</Button>
              <Button onClick={saveSettings}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

        {/* Modal de Backup e Dados */}
        <Dialog open={activeDialog === "backup"} onOpenChange={() => activeDialog === "backup" && closeDialog()}>
          <DialogContent className="sm:max-w-lg">
          <DialogHeader>
              <DialogTitle>Backup e Dados</DialogTitle>
            <DialogDescription>
                Gerencie backups e exportação de dados
            </DialogDescription>
          </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Frequência de Backup</Label>
                <Select 
                  value={settings.backup.frequency}
                  onValueChange={(value) => setSettings(prev => ({
                    ...prev,
                    backup: { ...prev.backup, frequency: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">A cada hora</SelectItem>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Dados
                </Button>
                <Button variant="outline" className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Importar Dados
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-backup">Backup Automático</Label>
                  <Switch 
                    id="auto-backup"
                    checked={settings.backup.autoBackup}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      backup: { ...prev.backup, autoBackup: checked }
                    }))}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Realizar backups automaticamente
                </p>
              </div>
          </div>
          <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>Cancelar</Button>
              <Button onClick={saveSettings}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

        {/* Modal de Aparência */}
        <Dialog open={activeDialog === "appearance"} onOpenChange={() => activeDialog === "appearance" && closeDialog()}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Aparência</DialogTitle>
              <DialogDescription>
                Personalize a aparência do sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Tema</Label>
                <Select 
                  value={settings.appearance.theme}
                  onValueChange={(value) => setSettings(prev => ({
                    ...prev,
                    appearance: { ...prev.appearance, theme: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cor Principal</Label>
                <Select 
                  value={settings.appearance.primaryColor}
                  onValueChange={(value) => setSettings(prev => ({
                    ...prev,
                    appearance: { ...prev.appearance, primaryColor: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a cor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Azul</SelectItem>
                    <SelectItem value="green">Verde</SelectItem>
                    <SelectItem value="purple">Roxo</SelectItem>
                    <SelectItem value="orange">Laranja</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="compact-mode">Modo Compacto</Label>
                  <Switch 
                    id="compact-mode"
                    checked={settings.appearance.compactMode}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      appearance: { ...prev.appearance, compactMode: checked }
                    }))}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Reduz o espaçamento entre elementos
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>Cancelar</Button>
              <Button onClick={saveSettings}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Email e Comunicação */}
        <Dialog open={activeDialog === "email"} onOpenChange={() => activeDialog === "email" && closeDialog()}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Email e Comunicação</DialogTitle>
              <DialogDescription>
                Configure as opções de email e comunicação
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Servidor SMTP</Label>
                <Input 
                  placeholder="smtp.exemplo.com"
                  value={settings.email.smtpServer}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    email: { ...prev.email, smtpServer: e.target.value }
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Porta SMTP</Label>
                <Input 
                  type="number" 
                  placeholder="587"
                  value={settings.email.smtpPort}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    email: { ...prev.email, smtpPort: parseInt(e.target.value) }
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Email de Remetente</Label>
                <Input 
                  type="email" 
                  placeholder="noreply@exemplo.com"
                  value={settings.email.senderEmail}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    email: { ...prev.email, senderEmail: e.target.value }
                  }))}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Notificações por Email</Label>
                  <Switch 
                    id="email-notifications"
                    checked={settings.email.notifications}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      email: { ...prev.email, notifications: checked }
                    }))}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Enviar notificações por email
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>Cancelar</Button>
              <Button onClick={saveSettings}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Integrações */}
        <Dialog open={activeDialog === "integrations"} onOpenChange={() => activeDialog === "integrations" && closeDialog()}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Integrações</DialogTitle>
              <DialogDescription>
                Conecte com outros serviços e plataformas
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="google-calendar">Google Calendar</Label>
                  <Switch 
                    id="google-calendar"
                    checked={settings.integrations.googleCalendar}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      integrations: { ...prev.integrations, googleCalendar: checked }
                    }))}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Sincronize eventos com o Google Calendar
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slack">Slack</Label>
                  <Switch 
                    id="slack"
                    checked={settings.integrations.slack}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      integrations: { ...prev.integrations, slack: checked }
                    }))}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Receba notificações no Slack
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="microsoft-teams">Microsoft Teams</Label>
                  <Switch 
                    id="microsoft-teams"
                    checked={settings.integrations.microsoftTeams}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      integrations: { ...prev.integrations, microsoftTeams: checked }
                    }))}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Integre com Microsoft Teams
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>Cancelar</Button>
              <Button onClick={saveSettings}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Suporte e Ajuda */}
        <Dialog open={activeDialog === "support"} onOpenChange={() => activeDialog === "support" && closeDialog()}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Suporte e Ajuda</DialogTitle>
              <DialogDescription>
                Recursos de suporte e documentação
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Email de Suporte</Label>
                <Input 
                  type="email" 
                  placeholder="suporte@exemplo.com"
                  value={settings.support.supportEmail}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    support: { ...prev.support, supportEmail: e.target.value }
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Mensagem de Suporte</Label>
                <Textarea 
                  placeholder="Digite uma mensagem para o suporte..."
                  className="h-20"
                  value={settings.support.supportMessage}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    support: { ...prev.support, supportMessage: e.target.value }
                  }))}
                />
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat de Suporte
                </Button>
                <Button variant="outline" className="w-full">
                  <Globe className="mr-2 h-4 w-4" />
                  Documentação
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>Cancelar</Button>
              <Button onClick={saveSettings}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Configuracoes;
