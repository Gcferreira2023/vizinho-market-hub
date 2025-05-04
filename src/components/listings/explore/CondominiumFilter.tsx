
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Condominium } from "@/types/location";
import { supabase } from "@/integrations/supabase/client";
import { Home, MapPin } from "lucide-react";

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
    <div className={`rounded-lg p-4 mb-6 flex items-center justify-between ${
      isCondominiumFilter 
        ? 'bg-primary/20 border border-primary/30' 
        : 'bg-muted/50'
    }`}>
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
          isCondominiumFilter ? 'bg-primary/20' : 'bg-gray-100'
        }`}>
          <MapPin className={`h-5 w-5 ${isCondominiumFilter ? 'text-primary' : 'text-gray-500'}`} />
        </div>
        
        <div>
          <div className="flex items-center">
            <h3 className={`font-medium text-sm ${isCondominiumFilter ? 'text-primary' : ''}`}>
              Meu Condomínio
            </h3>
            
            {isCondominiumFilter && (
              <Badge className="ml-2 bg-primary/30 text-primary border-0">
                Filtro ativo
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mt-0.5">
            {condominium.name}
            {condominium.cities && (
              <span className="ml-1 text-gray-500">
                ({condominium.cities.name})
              </span>
            )}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Label htmlFor="condominium-filter" className={`text-sm ${isCondominiumFilter ? 'font-medium' : ''}`}>
          {isCondominiumFilter ? 'Mostrando apenas anúncios do seu condomínio' : 'Mostrar apenas do meu condomínio'}
        </Label>
        <Switch
          id="condominium-filter"
          checked={isCondominiumFilter}
          onCheckedChange={onToggleCondominiumFilter}
        />
      </div>
    </div>
  );
};

export default CondominiumFilter;
