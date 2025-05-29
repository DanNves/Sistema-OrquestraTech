import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', { // Assumindo a rota de login
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao fazer login');
      }

      const data = await response.json();
      // Assumindo que o token vem em um campo chamado 'token'
      localStorage.setItem('authToken', data.token); 

      console.log('Login bem-sucedido', data);
      // Redirecionar para a página de eventos após login bem-sucedido
      navigate('/eventos'); 

    } catch (err: any) {
      console.error('Erro no login:', err);
      setError(err.message || 'Erro na comunicação com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl border border-blue-100">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-extrabold text-primary">Entrar</CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            Acesse sua conta para gerenciar seus eventos musicais
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2 text-left">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="bg-blue-50/50 focus:bg-white"
              />
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="bg-blue-50/50 focus:bg-white"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {error && <div className="text-red-500 text-sm w-full text-center">{error}</div>}
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold shadow-md hover:from-blue-600 hover:to-cyan-500 transition-colors" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Não tem uma conta?{' '}
              <Button
                variant="link"
                className="p-0 text-blue-600 hover:underline"
                onClick={() => navigate("/cadastro")}
              >
                Criar conta
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login; 