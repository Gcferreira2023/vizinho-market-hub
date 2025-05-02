
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const { toast } = useToast();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Obtém a URL de origem se existir
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) throw error;
      
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao VizinhoMarket!",
      });
      
      // Redireciona para a página de origem ou para a home
      navigate(from, { replace: true });
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Verifique suas credenciais e tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="bg-primary p-1 rounded">
              <ShoppingCart size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold text-primary">VizinhoMarket</span>
          </Link>
          <CardTitle className="text-2xl">Entrar</CardTitle>
          <CardDescription>
            Acesse sua conta para comprar e vender no condomínio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link
                  to="/recuperar-senha"
                  className="text-sm text-primary hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Não tem uma conta?{" "}
            <Link to="/cadastro" className="text-primary hover:underline">
              Cadastre-se
            </Link>
          </div>
          <Link to="/" className="text-sm text-center text-muted-foreground hover:underline">
            Voltar para o início
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
