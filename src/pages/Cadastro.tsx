import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const cargos = [
  "Músico",
  "Organista",
  "Instrutor(a)",
  "Candidato(a)",
  "Encarregado Local",
  "Encarregado Regional",
  "Examinadora"
];

const Cadastro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    cargo: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // TODO: Implementar lógica de cadastro
    console.log("Dados de cadastro:", formData);

    // Simulação de cadastro bem-sucedido e redirecionamento
    setTimeout(() => {
      setLoading(false);
      console.log('Cadastro simulado bem-sucedido');
      toast({
        title: "Solicitação enviada!",
        description: "Solicitação de acesso enviada ao Administrador!",
        variant: "success"
      });
      setTimeout(() => navigate("/login"), 2000);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl border border-blue-100">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-extrabold text-primary">Criar Conta</CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            Preencha os dados abaixo para criar sua conta e participar de experiências musicais únicas
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2 text-left">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                name="nome"
                type="text"
                placeholder="Seu nome completo"
                value={formData.nome}
                onChange={handleChange}
                required
                className="bg-blue-50/50 focus:bg-white"
              />
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-blue-50/50 focus:bg-white"
              />
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="cargo">Cargo</Label>
              <select
                id="cargo"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-input bg-blue-50/50 px-3 py-2 text-sm focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="" disabled>Selecione o cargo</option>
                {cargos.map((cargo) => (
                  <option key={cargo} value={cargo}>{cargo}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                name="senha"
                type="password"
                value={formData.senha}
                onChange={handleChange}
                required
                className="bg-blue-50/50 focus:bg-white"
              />
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
              <Input
                id="confirmarSenha"
                name="confirmarSenha"
                type="password"
                value={formData.confirmarSenha}
                onChange={handleChange}
                required
                className="bg-blue-50/50 focus:bg-white"
              />
            </div>
          </CardContent>
          {error && <div className="text-red-500 text-sm w-full text-center">{error}</div>}
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold shadow-md hover:from-blue-600 hover:to-cyan-500 transition-colors" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Já tem uma conta?{' '}
              <Button
                variant="link"
                className="p-0 text-blue-600 hover:underline"
                onClick={() => navigate("/login")}
              >
                Fazer login
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Cadastro; 