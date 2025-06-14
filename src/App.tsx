import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import { Dashboard } from './pages/Dashboard';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Equipes from "./pages/Equipes";
import Eventos from "./pages/Eventos";
import Usuarios from "./pages/Usuarios";
import Configuracoes from "./pages/Configuracoes";
import Questionarios from './pages/Questionarios';
import RelatorioUsuarios from './pages/RelatorioUsuarios';
import RelatorioEventos from './pages/RelatorioEventos';
import RelatorioEquipes from './pages/RelatorioEquipes';
import RelatorioInscricoes from './pages/RelatorioInscricoes';
import Alertas from './pages/Alertas';
import { ToastContainer } from './components/Toast';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/equipes" element={<Equipes />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/questionarios" element={<Questionarios />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/alertas" element={<Alertas />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/relatorios/usuarios" element={<RelatorioUsuarios />} />
        <Route path="/relatorios/eventos" element={<RelatorioEventos />} />
        <Route path="/relatorios/equipes" element={<RelatorioEquipes />} />
        <Route path="/relatorios/inscricoes" element={<RelatorioInscricoes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
