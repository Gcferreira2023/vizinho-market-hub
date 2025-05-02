
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { supabase } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import PasswordStrengthIndicator from "@/components/auth/PasswordStrengthIndicator";
import { getPasswordStrength } from "@/utils/passwordUtils";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("fraca");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(getPasswordStrength(newPassword));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }
    
    if (passwordStrength === "fraca") {
      toast({
        title: "Senha fraca",
        description: "Por favor, escolha uma senha mais forte",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso",
      });
      
      // Redireciona para login após sucesso
      setTimeout(() => navigate("/login"), 1500);
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar senha",
        description: error.message || "Ocorreu um erro ao atualizar sua senha",
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
          <CardTitle className="text-2xl">Criar nova senha</CardTitle>
          <CardDescription>
            Digite e confirme sua nova senha
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                required
              />
              <PasswordStrengthIndicator strength={passwordStrength as any} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirme a senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Atualizando..." : "Atualizar senha"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/login" className="text-sm text-primary hover:underline">
            Voltar para login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UpdatePassword;
