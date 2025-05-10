
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Building } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";

interface MyCondominiumToggleProps {
  isCondominiumFilter: boolean;
  onToggleCondominiumFilter: (value: boolean) => void;
}

const MyCondominiumToggle = ({
  isCondominiumFilter,
  onToggleCondominiumFilter,
}: MyCondominiumToggleProps) => {
  const { user } = useAuth();
  const userCondominiumId = user?.user_metadata?.condominiumId;
  const isLoggedIn = !!user;

  if (!isLoggedIn) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center space-x-2 opacity-70">
              <Building size={18} className="text-muted-foreground" />
              <Switch id="condominium-filter" disabled />
              <Label htmlFor="condominium-filter" className="cursor-not-allowed">
                Apenas meu condomínio
              </Label>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Faça login para ver anúncios do seu condomínio</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (!userCondominiumId) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Building 
        size={18} 
        className={isCondominiumFilter ? "text-primary" : "text-muted-foreground"} 
      />
      <Switch 
        id="condominium-filter"
        checked={isCondominiumFilter}
        onCheckedChange={onToggleCondominiumFilter}
        className={`transition-all duration-200 ${isCondominiumFilter ? "bg-primary" : ""}`}
      />
      <Label 
        htmlFor="condominium-filter" 
        className={`cursor-pointer ${isCondominiumFilter ? "font-medium text-primary" : ""}`}
      >
        Apenas meu condomínio
        {isCondominiumFilter && <span className="text-xs ml-1 text-primary block">• Filtro ativo</span>}
      </Label>
    </div>
  );
};

export default MyCondominiumToggle;
