
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, PenSquare, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import UserLocationInfo from "./UserLocationInfo";

const ProfileCard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  // Dados do usuário a partir dos metadados do Supabase Auth
  const userData = user?.user_metadata || {};

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você saiu da sua conta"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível fazer logout",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4">
          <User size={40} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold">{userData.full_name || "Usuário"}</h2>
        <p className="text-gray-500">
          {`Bloco ${userData.block || '-'}, Apt ${userData.apartment || '-'}`}
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p>{user?.email}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Telefone</p>
          <p>{userData.phone || "Não informado"}</p>
        </div>
        
        {/* Informações do condomínio */}
        <UserLocationInfo />
        
        <div className="pt-4 flex flex-col space-y-2">
          <Button asChild variant="outline" className="w-full">
            <Link to="/editar-perfil" className="flex items-center">
              <PenSquare className="mr-2" size={16} />
              Editar Perfil
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2" size={16} />
            Sair
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
