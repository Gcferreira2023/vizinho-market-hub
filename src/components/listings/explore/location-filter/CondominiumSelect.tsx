
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Condominium } from "@/types/location";
import { fetchCondominiumsByCity } from "@/services/location/locationService";
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
  const [condominiums, setCondominiums] = useState<Condominium[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
        setCondominiums(condominiumsData);
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
    setSelectedCondominiumId(value || null);
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
          value={selectedCondominiumId || ""} 
          onValueChange={handleCondominiumChange}
        >
          <SelectTrigger id="condominium-select">
            <SelectValue placeholder="Selecione um condomínio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os condomínios</SelectItem>
            {condominiums.map((condominium) => (
              <SelectItem key={condominium.id} value={condominium.id}>
                {condominium.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default CondominiumSelect;
