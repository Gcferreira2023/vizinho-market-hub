
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { usePhoneMask } from "@/hooks/usePhoneMask";

const EditProfile = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { applyMask } = usePhoneMask();
  
  const [formData, setFormData] = useState({
    fullName: "",
    apartment: "",
    block: "",
    phone: ""
  });
  
  useEffect(() => {
    if (user?.user_metadata) {
      const metadata = user.user_metadata;
      setFormData({
        fullName: metadata.full_name || "",
        apartment: metadata.apartment || "",
        block: metadata.block || "",
        phone: metadata.phone || ""
      });
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = applyMask(e.target.value);
    setFormData(prev => ({
      ...prev,
      phone: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await updateProfile(formData);
      
      if (error) throw error;
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso"
      });
      
      // Redireciona para a página de perfil
      navigate("/perfil");
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao atualizar seu perfil",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Editar Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome completo</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apartment">Número do apartamento</Label>
                  <Input
                    id="apartment"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="block">Bloco/Torre</Label>
                  <Input
                    id="block"
                    name="block"
                    value={formData.block}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone (WhatsApp)</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/perfil")}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Salvando..." : "Salvar alterações"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditProfile;
