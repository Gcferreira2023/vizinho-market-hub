
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { City, Condominium, State } from "@/types/location";
import { 
  fetchStates, 
  fetchCitiesByState, 
  fetchCondominiumsByCity 
} from "@/services/location/locationService";

interface LocationDataState {
  states: State[];
  cities: City[];
  condominiums: Condominium[];
  selectedState: string;
  selectedCity: string;
  selectedCondominium: string;
  loading: {
    states: boolean;
    cities: boolean;
    condominiums: boolean;
    suggestion: boolean;
  };
}

interface UseLocationDataProps {
  initialValues?: {
    stateId?: string;
    cityId?: string;
    condominiumId?: string;
  };
  onLocationSelected?: (location: {
    stateId: string;
    cityId: string;
    condominiumId: string;
  }) => void;
}

export const useLocationData = ({ initialValues = {}, onLocationSelected }: UseLocationDataProps = {}) => {
  const { toast } = useToast();
  const [data, setData] = useState<LocationDataState>({
    states: [],
    cities: [],
    condominiums: [],
    selectedState: initialValues?.stateId || "",
    selectedCity: initialValues?.cityId || "",
    selectedCondominium: initialValues?.condominiumId || "",
    loading: {
      states: false,
      cities: false,
      condominiums: false,
      suggestion: false
    }
  });

  // Fetch states on mount
  useEffect(() => {
    const loadStates = async () => {
      setData(prev => ({ ...prev, loading: { ...prev.loading, states: true } }));
      try {
        const statesData = await fetchStates();
        setData(prev => ({ ...prev, states: statesData, loading: { ...prev.loading, states: false } }));
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os estados",
          variant: "destructive"
        });
        setData(prev => ({ ...prev, loading: { ...prev.loading, states: false } }));
      }
    };
    
    loadStates();
  }, [toast]);

  // Fetch cities when state changes
  useEffect(() => {
    if (!data.selectedState) {
      setData(prev => ({ ...prev, cities: [] }));
      return;
    }

    const loadCities = async () => {
      setData(prev => ({ ...prev, loading: { ...prev.loading, cities: true } }));
      try {
        const citiesData = await fetchCitiesByState(data.selectedState);
        setData(prev => ({ 
          ...prev, 
          cities: citiesData, 
          loading: { ...prev.loading, cities: false } 
        }));
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar as cidades",
          variant: "destructive"
        });
        setData(prev => ({ ...prev, loading: { ...prev.loading, cities: false } }));
      }
    };
    
    loadCities();
  }, [data.selectedState, toast]);

  // Fetch condominiums when city changes
  useEffect(() => {
    if (!data.selectedCity) {
      setData(prev => ({ ...prev, condominiums: [] }));
      return;
    }

    const loadCondominiums = async () => {
      setData(prev => ({ ...prev, loading: { ...prev.loading, condominiums: true } }));
      try {
        const condominiumsData = await fetchCondominiumsByCity(data.selectedCity);
        setData(prev => ({ 
          ...prev, 
          condominiums: condominiumsData, 
          loading: { ...prev.loading, condominiums: false } 
        }));
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os condomínios",
          variant: "destructive"
        });
        setData(prev => ({ ...prev, loading: { ...prev.loading, condominiums: false } }));
      }
    };
    
    loadCondominiums();
  }, [data.selectedCity, toast]);

  // Notify when location is fully selected
  useEffect(() => {
    if (data.selectedState && data.selectedCity && data.selectedCondominium && onLocationSelected) {
      onLocationSelected({
        stateId: data.selectedState,
        cityId: data.selectedCity,
        condominiumId: data.selectedCondominium
      });
    }
  }, [data.selectedState, data.selectedCity, data.selectedCondominium, onLocationSelected]);

  const setSelectedState = (stateId: string) => {
    setData(prev => ({ 
      ...prev, 
      selectedState: stateId,
      selectedCity: "",
      selectedCondominium: ""
    }));
  };

  const setSelectedCity = (cityId: string) => {
    setData(prev => ({ 
      ...prev, 
      selectedCity: cityId,
      selectedCondominium: ""
    }));
  };

  const setSelectedCondominium = (condominiumId: string) => {
    setData(prev => ({ 
      ...prev, 
      selectedCondominium: condominiumId 
    }));
  };

  const setLoading = (key: keyof LocationDataState['loading'], value: boolean) => {
    setData(prev => ({
      ...prev,
      loading: { ...prev.loading, [key]: value }
    }));
  };

  return {
    ...data,
    setSelectedState,
    setSelectedCity,
    setSelectedCondominium,
    setLoading
  };
};
