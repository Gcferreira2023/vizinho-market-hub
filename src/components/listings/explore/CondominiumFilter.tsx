
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Condominium } from "@/types/location";
import { supabase } from "@/integrations/supabase/client";
import { Home } from "lucide-react";

interface CondominiumFilterProps {
  isCondominiumFilter: boolean;
  onToggleCondominiumFilter: (enabled: boolean) => void;
}

const CondominiumFilter = ({
  isCondominiumFilter,
  onToggleCondominiumFilter
}: CondominiumFilterProps) => {
  const { user } = useAuth();
  const [condominium, setCondominium] = useState<Condominium | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Buscar informações do condomínio do usuário se estiver logado
    const fetchUserCondominium = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Obter o ID do condomínio dos metadados do usuário
        const condominiumId = user.user_metadata?.condominiumId;
        
        if (!condominiumId) return;
        
        const { data, error } = await supabase
          .from('condominiums')
          .select(`
            *,
            cities!inner(
              id, 
              name, 
              state_id, 
              states(id, name, uf)
            )
          `)
          .eq('id', condominiumId)
          .single();
          
        if (error) throw error;
        
        // Ensure proper typing for the condominium data
        setCondominium(data as unknown as Condominium);
      } catch (error) {
        console.error('Erro ao buscar condomínio:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCondominium();
  }, [user]);

  // Se o usuário não estiver logado ou não tiver condomínio configurado
  if (!user || !condominium) {
    return null;
  }

  return (
    <div className="bg-muted/50 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Home className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-medium text-sm">Meu Condomínio</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <Label htmlFor="condominium-filter" className="text-xs">
            Mostrar apenas
          </Label>
          <Switch
            id="condominium-filter"
            checked={isCondominiumFilter}
            onCheckedChange={onToggleCondominiumFilter}
          />
        </div>
      </div>
      
      <Badge variant="outline" className="mt-2 text-xs p-1 px-2 bg-background">
        {condominium.name}
        {condominium.cities && (
          <span className="ml-1 text-muted-foreground">
            ({condominium.cities.name})
          </span>
        )}
      </Badge>
    </div>
  );
};

export default CondominiumFilter;
