
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Condominium } from "@/types/location";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/ui/loading-spinner";

const UserLocationInfo = () => {
  const { user } = useAuth();
  const [condominium, setCondominium] = useState<Condominium | null>(null);
  const [isLoadingCondominium, setIsLoadingCondominium] = useState(false);
  
  useEffect(() => {
    // Buscar informações do condomínio
    const fetchCondominium = async () => {
      if (!user || !user.user_metadata?.condominiumId) return;
      
      try {
        setIsLoadingCondominium(true);
        const condominiumId = user.user_metadata.condominiumId;
        
        const { data, error } = await supabase
          .from('condominiums')
          .select(`
            *,
            cities (
              id,
              name,
              state_id,
              states (id, name, uf)
            )
          `)
          .eq('id', condominiumId)
          .single();
          
        if (error) {
          console.error('Erro ao buscar condomínio:', error);
          return;
        }
        
        setCondominium(data as Condominium);
      } catch (error) {
        console.error('Erro ao buscar condomínio:', error);
      } finally {
        setIsLoadingCondominium(false);
      }
    };
    
    fetchCondominium();
  }, [user]);
  
  return (
    <div>
      <div className="flex items-center gap-1">
        <MapPin className="h-4 w-4 text-primary" />
        <p className="text-sm text-gray-500">Condomínio</p>
      </div>
      
      {isLoadingCondominium ? (
        <div className="flex justify-center py-2">
          <LoadingSpinner size="sm" />
        </div>
      ) : condominium ? (
        <div className="mt-1">
          <Badge variant="outline" className="text-xs">
            {condominium.name}
          </Badge>
          {condominium.cities && (
            <p className="mt-1 text-xs text-gray-500">
              {condominium.cities.name} - {condominium.cities.states?.uf}
            </p>
          )}
        </div>
      ) : (
        <p className="italic text-sm text-gray-400">Não configurado</p>
      )}
    </div>
  );
};

export default UserLocationInfo;
