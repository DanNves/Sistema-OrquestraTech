import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      <header className="w-full border-b border-border py-4 px-6 bg-background/80 backdrop-blur-sm fixed top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">
            OrquestraTech
          </h1>
          {/* Futuros links de navegação podem vir aqui */}
        </div>
      </header>
      <div className="container mx-auto px-4 py-24 flex-grow flex items-center">
        <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left space-y-12 md:space-y-0 md:space-x-12 mt-16">
          <div className="flex flex-col items-center md:items-start space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary">
              Gerencie sua Orquestra<br className="hidden md:inline"/> com Eficiência
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Simplifique a gestão de equipes, eventos e membros com uma plataforma completa e intuitiva.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button 
                size="lg" 
                onClick={() => navigate("/cadastro")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-base"
              >
                Começar Agora
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/login")}
                className="px-8 py-3 text-base"
              >
                Entrar
              </Button>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center">
            {/* Aqui poderia ir uma ilustração inspirada no modelo */}
            {/* Por enquanto, apenas um placeholder ou podemos remover se preferir */}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
           <h2 className="text-3xl font-bold tracking-tight text-primary">Funcionalidades</h2>
           <p className="text-lg text-muted-foreground mt-2">O que o OrquestraTech pode fazer por você.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg bg-card border border-border shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Gestão de Equipes</h3>
            <p className="text-muted-foreground">
              Organize suas equipes musicais de forma eficiente
            </p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Eventos</h3>
            <p className="text-muted-foreground">
              Planeje e gerencie seus eventos musicais
            </p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Colaboração</h3>
            <p className="text-muted-foreground">
              Trabalhe em equipe de forma integrada
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing; 