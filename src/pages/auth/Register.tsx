
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import RegisterStep1Form from "@/components/auth/RegisterStep1Form";
import RegisterStep2Form from "@/components/auth/RegisterStep2Form";
import { Step1FormData, Step2FormData } from "@/components/auth/RegisterFormSchemas";

const Register = () => {
  const { toast } = useToast();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1FormData | null>(null);

  // Função para lidar com o envio do primeiro passo
  const onFirstStepSubmit = (data: Step1FormData) => {
    console.log("Primeiro passo validado com sucesso, avançando...", data);
    setStep1Data(data);
    setStep(2);
  };

  const onFinalSubmit = async (stepData: Step2FormData) => {
    console.log("Tentando finalizar cadastro");
    
    // Verificar se temos os dados do primeiro passo antes de prosseguir
    if (!step1Data) {
      console.error("Dados do primeiro passo não encontrados");
      toast({
        title: "Erro de registro",
        description: "Por favor, volte e preencha novamente o primeiro passo.",
        variant: "destructive"
      });
      setStep(1);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const userData = {
        fullName: step1Data.fullName,
        apartment: stepData.apartment,
        block: stepData.block,
        phone: stepData.phone
      };

      console.log("Enviando dados para signUp:", step1Data.email, "senha:", "***", userData);
      const { error } = await signUp(step1Data.email, step1Data.password, userData);
      
      if (error) {
        console.error("Erro ao cadastrar:", error);
        
        if (error.message && error.message.includes("User already registered")) {
          toast({
            title: "Email já cadastrado",
            description: "Este email já está sendo usado. Tente fazer login ou use outro email.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erro ao cadastrar",
            description: error.message || "Ocorreu um erro ao criar sua conta. Tente novamente.",
            variant: "destructive"
          });
        }
        setIsLoading(false);
        return;
      }

      toast({
        title: "Cadastro realizado!",
        description: "Sua conta foi criada com sucesso. É necessário verificar seu email antes de fazer login. Por favor, verifique sua caixa de entrada.",
      });
      
      // Redireciona para a página de login após cadastro bem-sucedido
      navigate("/login");
    } catch (err) {
      console.error("Erro geral:", err);
      toast({
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro ao criar sua conta. Tente novamente mais tarde.",
        variant: "destructive"
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
          <CardTitle className="text-2xl">Criar Conta</CardTitle>
          <CardDescription>
            {step === 1 ? "Seus dados pessoais" : "Informações do condomínio"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 ? (
            <RegisterStep1Form onSubmit={onFirstStepSubmit} />
          ) : (
            <RegisterStep2Form 
              onSubmit={onFinalSubmit} 
              onBack={() => setStep(1)}
              isLoading={isLoading}
            />
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Entrar
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

export default Register;
