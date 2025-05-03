
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Step1FormData, step1SchemaWithValidation } from "./RegisterFormSchemas";
import PasswordStrengthIndicator from "@/components/auth/PasswordStrengthIndicator";
import { getPasswordStrength } from "@/utils/passwordUtils";

interface RegisterStep1FormProps {
  onSubmit: (data: Step1FormData) => void;
}

const RegisterStep1Form = ({ onSubmit }: RegisterStep1FormProps) => {
  const [passwordStrength, setPasswordStrength] = useState("fraca");

  const form = useForm<Step1FormData>({
    resolver: zodResolver(step1SchemaWithValidation),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("password", e.target.value);
    setPasswordStrength(getPasswordStrength(e.target.value));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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
  );
};

export default RegisterStep1Form;
