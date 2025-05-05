
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { State, City, Condominium } from "@/types/location";
import { fetchStates, fetchCitiesByState, fetchCondominiumsByCity } from "@/services/location/locationService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MobileLocationFilterProps {
  selectedStateId: string | null;
  setSelectedStateId: (stateId: string | null) => void;
  selectedCityId: string | null;
  setSelectedCityId: (cityId: string | null) => void;
  selectedCondominiumId: string | null;
  setSelectedCondominiumId: (condominiumId: string | null) => void;
}

const MobileLocationFilter = ({
  selectedStateId,
  setSelectedStateId,
  selectedCityId,
  setSelectedCityId,
  selectedCondominiumId,
  setSelectedCondominiumId
}: MobileLocationFilterProps) => {
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [condominiums, setCondominiums] = useState<Condominium[]>([]);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingCondominiums, setIsLoadingCondominiums] = useState(false);
  const { toast } = useToast();
  
  // Fetch states on component mount
  useEffect(() => {
    const loadStates = async () => {
      setIsLoadingStates(true);
      try {
        const statesData = await fetchStates();
        setStates(statesData);
      } catch (error) {
        console.error("Error fetching states:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar estados",
          description: "Não foi possível carregar a lista de estados."
        });
      } finally {
        setIsLoadingStates(false);
      }
    };
    
    loadStates();
  }, [toast]);
  
  // Fetch cities when state changes
  useEffect(() => {
    if (!selectedStateId) {
      setCities([]);
      return;
    }
    
    const loadCities = async () => {
      setIsLoadingCities(true);
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
        setIsLoadingCities(false);
      }
    };
    
    loadCities();
  }, [selectedStateId, toast]);
  
  // Fetch condominiums when city changes
  useEffect(() => {
    if (!selectedCityId) {
      setCondominiums([]);
      return;
    }
    
    const loadCondominiums = async () => {
      setIsLoadingCondominiums(true);
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
        setIsLoadingCondominiums(false);
      }
    };
    
    loadCondominiums();
  }, [selectedCityId, toast]);
  
  return (
    <div className="space-y-5 mt-4">
      <div className="flex items-center mb-1">
        <MapPin size={18} className="mr-2 text-primary" />
        <h3 className="font-medium">Localização</h3>
      </div>
      
      {/* State Select */}
      <div className="space-y-2">
        <Label htmlFor="mobile-state-select">Estado</Label>
        {isLoadingStates ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select 
            value={selectedStateId || ""} 
            onValueChange={(value) => {
              setSelectedStateId(value || null);
              setSelectedCityId(null);
              setSelectedCondominiumId(null);
            }}
          >
            <SelectTrigger id="mobile-state-select">
              <SelectValue placeholder="Selecione um estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os estados</SelectItem>
              {states.map((state) => (
                <SelectItem key={state.id} value={state.id}>
                  {state.name} ({state.uf})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      
      {/* City Select - Only show if state is selected */}
      {(selectedStateId || isLoadingCities) && (
        <div className="space-y-2">
          <Label htmlFor="mobile-city-select">Cidade</Label>
          {isLoadingCities ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select 
              value={selectedCityId || ""} 
              onValueChange={(value) => {
                setSelectedCityId(value || null);
                setSelectedCondominiumId(null);
              }}
            >
              <SelectTrigger id="mobile-city-select">
                <SelectValue placeholder="Selecione uma cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as cidades</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}
      
      {/* Condominium Select - Only show if city is selected */}
      {(selectedCityId || isLoadingCondominiums) && (
        <div className="space-y-2">
          <Label htmlFor="mobile-condominium-select">Condomínio</Label>
          {isLoadingCondominiums ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select 
              value={selectedCondominiumId || ""} 
              onValueChange={(value) => {
                setSelectedCondominiumId(value || null);
              }}
            >
              <SelectTrigger id="mobile-condominium-select">
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
      )}
    </div>
  );
};

export default MobileLocationFilter;
