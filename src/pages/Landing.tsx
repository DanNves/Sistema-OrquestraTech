import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "Gestão de Equipes",
    description: "Organize suas equipes musicais de forma eficiente.",
    icon: "🎵",
  },
  {
    title: "Eventos Integrados",
    description: "Planeje e gerencie seus eventos musicais com facilidade.",
    icon: "📅",
  },
  {
    title: "Colaboração",
    description: "Trabalhe em equipe de forma integrada e transparente.",
    icon: "🤝",
  },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <header className="w-full border-b border-border py-4 px-6 bg-white/80 backdrop-blur-sm fixed top-0 z-50 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <span className="text-2xl font-bold text-primary tracking-tight">OrquestraTech</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-12 pt-32 pb-20 px-4">
        {/* Left */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary leading-tight">
            Sistema de Gestão de Encontro Musical
          </h1>
          <div className="text-lg md:text-xl text-muted-foreground max-w-xl font-medium space-y-1">
            <p>Organize, conecte e faça seu evento musical acontecer com facilidade.</p>
            <p>Ou participe de uma experiência musical única.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Button 
              size="lg" 
              onClick={() => navigate("/cadastro")}
              className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg px-8 py-3 text-base font-semibold"
            >
              Criar Conta
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/login")}
              className="px-8 py-3 text-base font-semibold border-blue-400"
            >
              Entrar
            </Button>
          </div>
        </div>
        {/* Right (Ilustração ou imagem) */}
        <div className="flex-1 flex justify-center items-center">
          {/* Placeholder para ilustração */}
          <div className="w-[320px] h-[260px] bg-gradient-to-br from-blue-200 to-cyan-100 rounded-3xl shadow-xl flex items-center justify-center">
            <span className="text-7xl">🎻</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-primary">Funcionalidades</h2>
          <p className="text-lg text-muted-foreground mt-2">O que o OrquestraTech pode fazer por você.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              className="p-8 rounded-2xl bg-white border border-blue-100 shadow-lg flex flex-col items-center text-center transition-transform hover:-translate-y-2 hover:shadow-2xl duration-200"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-blue-700">{feature.title}</h3>
              <p className="text-muted-foreground mb-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-border py-8 px-6 bg-white/80 mt-auto">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} OrquestraTech. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default Landing; 