
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { City } from "@/types/location";
import { fetchCitiesByState } from "@/services/location/locationService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CitySelectProps {
  selectedStateId: string | null;
  selectedCityId: string | null;
  setSelectedCityId: (cityId: string | null) => void;
}

const CitySelect = ({ selectedStateId, selectedCityId, setSelectedCityId }: CitySelectProps) => {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch cities when state changes
  useEffect(() => {
    if (!selectedStateId) {
      setCities([]);
      return;
    }
    
    const loadCities = async () => {
      setIsLoading(true);
      try {
        const citiesData = await fetchCitiesByState(selectedStateId);
        setCities(citiesData);
      } catch (error) {
        console.error("Error fetching cities:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar cidades",
          description: "Não foi possível carregar a lista de cidades."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCities();
  }, [selectedStateId, toast]);

  // Handle city selection
  const handleCityChange = (value: string) => {
    setSelectedCityId(value === "all" ? null : value);
  };

  if (!selectedStateId && !isLoading) {
    return null;
  }

  return (
    <div className="space-y-1">
      <Label htmlFor="city-select">Cidade</Label>
      {isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <Select 
          value={selectedCityId || "all"} 
          onValueChange={handleCityChange}
        >
          <SelectTrigger id="city-select">
            <SelectValue placeholder="Selecione uma cidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as cidades</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.id}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default CitySelect;
