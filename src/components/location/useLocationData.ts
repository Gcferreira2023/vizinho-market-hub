
import { useState, useEffect, useCallback } from "react";
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
  errors: {
    states: string | null;
    cities: string | null;
    condominiums: string | null;
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
    },
    errors: {
      states: null,
      cities: null,
      condominiums: null
    }
  });

  // Load states with retry mechanism
  const loadStates = useCallback(async (isRetry = false) => {
    setData(prev => ({ 
      ...prev, 
      loading: { ...prev.loading, states: true },
      errors: { ...prev.errors, states: null }
    }));
    
    try {
      console.log(`${isRetry ? 'Retrying' : 'Starting'} to fetch states...`);
      const statesData = await fetchStates();
      
      setData(prev => ({ 
        ...prev, 
        states: statesData, 
        loading: { ...prev.loading, states: false },
        errors: { ...prev.errors, states: null }
      }));
      
      // Show toast only on retry
      if (isRetry) {
        toast({
          title: "Sucesso",
          description: "Lista de estados atualizada com sucesso",
        });
      }
    } catch (error) {
      console.error("Error fetching states:", error);
      
      setData(prev => ({ 
        ...prev, 
        loading: { ...prev.loading, states: false },
        errors: { ...prev.errors, states: "Não foi possível carregar os estados" }
      }));
      
      // Mock states as fallback
      setData(prev => ({
        ...prev,
        states: [
          { id: "1", name: "São Paulo", uf: "SP" },
          { id: "2", name: "Rio de Janeiro", uf: "RJ" },
          { id: "3", name: "Minas Gerais", uf: "MG" },
          { id: "4", name: "Bahia", uf: "BA" },
          { id: "5", name: "Rio Grande do Sul", uf: "RS" }
        ]
      }));
      
      if (!isRetry) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os estados. Usando dados offline.",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  // Load cities with retry mechanism
  const loadCities = useCallback(async (stateId: string, isRetry = false) => {
    if (!stateId) {
      setData(prev => ({ ...prev, cities: [] }));
      return;
    }

    setData(prev => ({ 
      ...prev, 
      loading: { ...prev.loading, cities: true },
      errors: { ...prev.errors, cities: null }
    }));
    
    try {
      console.log(`${isRetry ? 'Retrying' : 'Starting'} to fetch cities for state ${stateId}...`);
      const citiesData = await fetchCitiesByState(stateId);
      
      setData(prev => ({ 
        ...prev, 
        cities: citiesData, 
        loading: { ...prev.loading, cities: false },
        errors: { ...prev.errors, cities: null }
      }));
      
      // Show toast only on retry
      if (isRetry) {
        toast({
          title: "Sucesso",
          description: "Lista de cidades atualizada com sucesso",
        });
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      
      setData(prev => ({ 
        ...prev, 
        loading: { ...prev.loading, cities: false },
        errors: { ...prev.errors, cities: "Não foi possível carregar as cidades" }
      }));
      
      // Mock cities as fallback
      setData(prev => ({
        ...prev,
        cities: [
          { id: "1", name: "São Paulo", state_id: stateId },
          { id: "2", name: "Campinas", state_id: stateId },
          { id: "3", name: "Santos", state_id: stateId }
        ]
      }));
      
      if (!isRetry) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar as cidades. Usando dados offline.",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  // Load condominiums with retry mechanism
  const loadCondominiums = useCallback(async (cityId: string, isRetry = false) => {
    if (!cityId) {
      setData(prev => ({ ...prev, condominiums: [] }));
      return;
    }

    setData(prev => ({ 
      ...prev, 
      loading: { ...prev.loading, condominiums: true },
      errors: { ...prev.errors, condominiums: null }
    }));
    
    try {
      console.log(`${isRetry ? 'Retrying' : 'Starting'} to fetch condominiums for city ${cityId}...`);
      const condominiumsData = await fetchCondominiumsByCity(cityId);
      
      setData(prev => ({ 
        ...prev, 
        condominiums: condominiumsData, 
        loading: { ...prev.loading, condominiums: false },
        errors: { ...prev.errors, condominiums: null }
      }));
      
      // Show toast only on retry
      if (isRetry) {
        toast({
          title: "Sucesso",
          description: "Lista de condomínios atualizada com sucesso",
        });
      }
    } catch (error) {
      console.error("Error fetching condominiums:", error);
      
      setData(prev => ({ 
        ...prev, 
        loading: { ...prev.loading, condominiums: false },
        errors: { ...prev.errors, condominiums: "Não foi possível carregar os condomínios" }
      }));
      
      // Mock condominiums as fallback
      setData(prev => ({
        ...prev,
        condominiums: [
          { id: "1", name: "Condomínio Parque das Flores", city_id: cityId, approved: true },
          { id: "2", name: "Condomínio Solar das Paineiras", city_id: cityId, approved: true },
          { id: "3", name: "Condomínio Recanto Verde", city_id: cityId, approved: true }
        ]
      }));
      
      if (!isRetry) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os condomínios. Usando dados offline.",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  // Fetch states on mount
  useEffect(() => {
    loadStates();
  }, [loadStates]);

  // Fetch cities when state changes
  useEffect(() => {
    if (data.selectedState) {
      loadCities(data.selectedState);
    } else {
      setData(prev => ({ ...prev, cities: [], selectedCity: "", selectedCondominium: "" }));
    }
  }, [data.selectedState, loadCities]);

  // Fetch condominiums when city changes
  useEffect(() => {
    if (data.selectedCity) {
      loadCondominiums(data.selectedCity);
    } else {
      setData(prev => ({ ...prev, condominiums: [], selectedCondominium: "" }));
    }
  }, [data.selectedCity, loadCondominiums]);

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

  const retryLoadStates = () => {
    loadStates(true);
  };

  const retryLoadCities = () => {
    if (data.selectedState) {
      loadCities(data.selectedState, true);
    }
  };

  const retryLoadCondominiums = () => {
    if (data.selectedCity) {
      loadCondominiums(data.selectedCity, true);
    }
  };

  return {
    ...data,
    setSelectedState,
    setSelectedCity,
    setSelectedCondominium,
    setLoading,
    retryLoadStates,
    retryLoadCities,
    retryLoadCondominiums
  };
};
