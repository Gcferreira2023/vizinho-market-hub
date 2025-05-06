
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
            <div className="flex items-center space-x-2 mb-4 opacity-70">
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
    <div className="flex items-center space-x-2 mb-4 py-2 border-b">
      <Switch 
        id="condominium-filter"
        checked={isCondominiumFilter}
        onCheckedChange={onToggleCondominiumFilter}
        className="transition-transform duration-200 data-[state=checked]:bg-primary"
      />
      <Label 
        htmlFor="condominium-filter" 
        className="cursor-pointer font-medium"
      >
        Apenas meu condomínio
      </Label>
    </div>
  );
};

export default MyCondominiumToggle;
