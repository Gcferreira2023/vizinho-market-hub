
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { Step1FormData, Step2FormData } from "@/components/auth/RegisterFormSchemas";
import RegisterStep1Form from "@/components/auth/RegisterStep1Form";
import RegisterStep2Form from "@/components/auth/RegisterStep2Form";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<Partial<Step1FormData & Step2FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redireciona se o usuário já estiver logado
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleStep1Complete = (data: Step1FormData) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(2);
  };

  const handleStep2Complete = async (data: Step2FormData) => {
    setIsLoading(true);
    
    try {
      // Combinando os dados dos dois passos
      const completeData = {
        ...formData,
        ...data
      };
      
      const userData = {
        fullName: completeData.fullName,
        apartment: completeData.apartment,
        block: completeData.block,
        phone: completeData.phone,
        condominiumId: completeData.condominiumId,
      };
      
      const { error } = await signUp(completeData.email!, completeData.password!, userData);
      
      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "Email já cadastrado",
            description: "Este email já está em uso. Tente fazer login ou recuperar sua senha.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erro no cadastro",
            description: error.message || "Ocorreu um erro durante o cadastro. Tente novamente.",
            variant: "destructive"
          });
        }
        return;
      }
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Por favor, verifique seu email para confirmar sua conta."
      });
      
      // Redireciona para página de login após o cadastro
      navigate("/login");
    } catch (err: any) {
      toast({
        title: "Erro no cadastro",
        description: err.message || "Ocorreu um erro durante o cadastro. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
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
          <h1 className="text-2xl font-bold">Criar uma conta</h1>
          <p className="text-sm text-gray-500">
            {step === 1
              ? "Insira seus dados pessoais abaixo"
              : "Complete seu cadastro com sua localização"}
          </p>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <RegisterStep1Form onSubmit={handleStep1Complete} />
          ) : (
            <RegisterStep2Form 
              onSubmit={handleStep2Complete} 
              onBack={handleBack}
              isLoading={isLoading}
            />
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center">
            <span className="text-sm text-gray-500">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Fazer login
              </Link>
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
