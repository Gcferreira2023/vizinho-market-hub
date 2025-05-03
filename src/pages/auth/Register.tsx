
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { usePhoneMask } from "@/hooks/usePhoneMask";
import PasswordStrengthIndicator from "@/components/auth/PasswordStrengthIndicator";
import { getPasswordStrength } from "@/utils/passwordUtils";
import { useAuth } from "@/contexts/AuthContext";

// Defining separate schemas for each step to avoid the refine/pick issue
const step1Schema = z.object({
  fullName: z.string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
  email: z.string()
    .email("Email com formato inválido"),
  password: z.string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/\d/, "Senha deve incluir pelo menos 1 número")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Senha deve incluir pelo menos 1 caractere especial"),
  confirmPassword: z.string()
});

// Add the refine check to step1Schema separately
const step1SchemaWithValidation = step1Schema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  }
);

// Define step 2 schema separately
const step2Schema = z.object({
  apartment: z.string()
    .min(1, "Número do apartamento é obrigatório")
    .regex(/^\d+$/, "Apartamento deve ser um número"),
  block: z.string()
    .min(1, "Bloco/Torre é obrigatório"),
  phone: z.string()
    .min(14, "Telefone incompleto"),
  terms: z.boolean()
    .refine(value => value === true, {
      message: "Você precisa concordar com os Termos de Uso e Política de Privacidade",
    })
});

// We can still define the full schema for type inference if needed
const registerSchema = step1Schema.merge(step2Schema).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  }
);

type RegisterFormData = z.infer<typeof registerSchema>;
type Step1FormData = z.infer<typeof step1Schema>;
type Step2FormData = z.infer<typeof step2Schema>;

const Register = () => {
  const { toast } = useToast();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState("fraca");
  const { applyMask } = usePhoneMask();
  const [step1Data, setStep1Data] = useState<Step1FormData | null>(null);

  // Formulário para o primeiro passo usando o schema específico do passo 1
  const form1 = useForm<Step1FormData>({
    resolver: zodResolver(step1SchemaWithValidation),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  // Formulário para o segundo passo usando o schema específico do passo 2
  const form2 = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      apartment: "",
      block: "",
      phone: "",
      terms: false,
    },
    mode: "onChange",
  });
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form1.setValue("password", e.target.value);
    setPasswordStrength(getPasswordStrength(e.target.value));
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = applyMask(e.target.value);
    form2.setValue("phone", value);
  };

  // Função para lidar com o envio do primeiro passo
  const onFirstStepSubmit = (data: Step1FormData) => {
    console.log("Primeiro passo validado com sucesso, avançando...", data);
    setStep1Data(data);
    setStep(2);
  };

  const onFinalSubmit = async (stepData: Step2FormData) => {
    console.log("Tentando finalizar cadastro");
    
    // Make sure we have step1Data before proceeding
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
        description: "Sua conta foi criada com sucesso. Faça login para continuar.",
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
            <Form {...form1}>
              <form onSubmit={form1.handleSubmit(onFirstStepSubmit)} className="space-y-4">
                <FormField
                  control={form1.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="João Silva"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form1.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form1.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          onChange={(e) => {
                            handlePasswordChange(e);
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <PasswordStrengthIndicator strength={passwordStrength as any} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form1.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirme sua senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button className="w-full" type="submit">
                  Continuar
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...form2}>
              <form onSubmit={form2.handleSubmit(onFinalSubmit)} className="space-y-4">
                <FormField
                  control={form2.control}
                  name="apartment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número do Apartamento</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="101"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form2.control}
                  name="block"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bloco/Torre</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="A"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form2.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone (WhatsApp)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(11) 99999-9999"
                          {...field}
                          onChange={(e) => {
                            handlePhoneChange(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form2.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm text-gray-700">
                          Concordo com os{" "}
                          <Link to="/termos" className="text-primary hover:underline">
                            Termos de Uso
                          </Link>
                          {" "}e{" "}
                          <Link to="/privacidade" className="text-primary hover:underline">
                            Política de Privacidade
                          </Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setStep(1)}
                    type="button"
                  >
                    Voltar
                  </Button>
                  <Button 
                    className="flex-1" 
                    type="submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Cadastrando..." : "Cadastrar"}
                  </Button>
                </div>
              </form>
            </Form>
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
