
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Condominium } from "@/types/location";
import { fetchCondominiumsByCity } from "@/services/location/locationService";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CondominiumSelectProps {
  selectedCityId: string | null;
  selectedCondominiumId: string | null;
  setSelectedCondominiumId: (condominiumId: string | null) => void;
}

const CondominiumSelect = ({ 
  selectedCityId, 
  selectedCondominiumId, 
  setSelectedCondominiumId 
}: CondominiumSelectProps) => {
  const [condominiums, setCondominiums] = useState<(Condominium & { adCount?: number })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const userCondominiumId = user?.user_metadata?.condominiumId;

  // Fetch condominiums when city changes
  useEffect(() => {
    if (!selectedCityId) {
      setCondominiums([]);
      return;
    }
    
    const loadCondominiums = async () => {
      setIsLoading(true);
      try {
        const condominiumsData = await fetchCondominiumsByCity(selectedCityId);
        
        // Fetch ad counts for each condominium
        const condominiumsWithCounts = await Promise.all(
          condominiumsData.map(async (condominium) => {
            try {
              const { count, error } = await supabase
                .from('ads')
                .select('*', { count: 'exact', head: true })
                .eq('condominium_id', condominium.id)
                .eq('status', 'active');
                
              if (error) throw error;
              
              return {
                ...condominium,
                adCount: count || 0
              };
            } catch (err) {
              console.error(`Error fetching ad count for condominium ${condominium.id}:`, err);
              return {
                ...condominium,
                adCount: 0
              };
            }
          })
        );
        
        // Sort alphabetically by name
        const sortedCondominiums = condominiumsWithCounts.sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        
        setCondominiums(sortedCondominiums);
      } catch (error) {
        console.error("Error fetching condominiums:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar condomínios",
          description: "Não foi possível carregar a lista de condomínios."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCondominiums();
  }, [selectedCityId, toast]);

  // Handle condominium selection
  const handleCondominiumChange = (value: string) => {
    setSelectedCondominiumId(value === "all" ? null : value);
  };

  if (!selectedCityId && !isLoading) {
    return null;
  }

  return (
    <div className="space-y-1">
      <Label htmlFor="condominium-select">Condomínio</Label>
      {isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <Select 
          value={selectedCondominiumId || "all"} 
          onValueChange={handleCondominiumChange}
          disabled={!selectedCityId}
        >
          <SelectTrigger id="condominium-select">
            <SelectValue placeholder="Selecione um condomínio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os condomínios</SelectItem>
            {condominiums.length > 0 ? (
              condominiums.map((condominium) => (
                <SelectItem 
                  key={condominium.id} 
                  value={condominium.id}
                  className={userCondominiumId === condominium.id ? "font-medium text-primary" : ""}
                >
                  {condominium.name} ({condominium.adCount})
                </SelectItem>
              ))
            ) : (
              <div className="px-2 py-1 text-sm text-gray-500">
                Nenhum condomínio encontrado nesta cidade
              </div>
            )}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default CondominiumSelect;
