
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Step2FormData, step2Schema } from "./RegisterFormSchemas";
import { usePhoneMask } from "@/hooks/usePhoneMask";
import LocationSelector from "./LocationSelector";
import { Card, CardContent } from "../ui/card";

interface RegisterStep2FormProps {
  onSubmit: (data: Step2FormData) => void;
  onBack: () => void;
  isLoading: boolean;
}

const RegisterStep2Form = ({ onSubmit, onBack, isLoading }: RegisterStep2FormProps) => {
  const { applyMask } = usePhoneMask();
  
  const form = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      apartment: "",
      block: "",
      phone: "",
      stateId: "",
      cityId: "",
      condominiumId: "",
      terms: false,
    },
    mode: "onChange",
  });
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = applyMask(e.target.value);
    form.setValue("phone", value);
  };

  const handleLocationSelected = (location: {
    stateId: string;
    cityId: string;
    condominiumId: string;
  }) => {
    form.setValue("stateId", location.stateId);
    form.setValue("cityId", location.cityId);
    form.setValue("condominiumId", location.condominiumId);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium mb-4">Localização</h3>
            <LocationSelector onLocationSelected={handleLocationSelected} initialValues={{}} />
            <FormField
              control={form.control}
              name="stateId"
              render={() => <></>}
            />
            <FormField
              control={form.control}
              name="cityId"
              render={() => <></>}
            />
            <FormField
              control={form.control}
              name="condominiumId"
              render={() => (
                <FormMessage />
              )}
            />
          </CardContent>
        </Card>
        
        <FormField
          control={form.control}
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
            onClick={onBack}
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
  );
};

export default RegisterStep2Form;
