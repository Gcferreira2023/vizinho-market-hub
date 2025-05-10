import { supabase } from "@/integrations/supabase/client";
import { City, Condominium, State } from "@/types/location";

// Mock data for fallbacks
const mockStates = [
  { id: "1", name: "São Paulo", uf: "SP" },
  { id: "2", name: "Rio de Janeiro", uf: "RJ" },
  { id: "3", name: "Minas Gerais", uf: "MG" },
  { id: "4", name: "Bahia", uf: "BA" },
  { id: "5", name: "Rio Grande do Sul", uf: "RS" }
];

// Buscar todos os estados
export const fetchStates = async (): Promise<State[]> => {
  try {
    console.log("Iniciando fetchStates");
    
    // Verificar se o cliente supabase está configurado
    if (!supabase) {
      console.error("Cliente Supabase não inicializado");
      console.log("Retornando dados mock para estados");
      return [...mockStates];
    }
    
    // Track request start time for debugging
    const startTime = Date.now();
    
    const { data, error } = await supabase
      .from('states')
      .select('*')
      .order('name')
      .timeout(5000); // Adding timeout to avoid infinite loading
    
    // Log request duration
    console.log(`Tempo de resposta da API: ${Date.now() - startTime}ms`);
    
    if (error) {
      console.error("Erro ao buscar estados:", error);
      console.log("Retornando dados mock para estados devido a erro");
      return [...mockStates];
    }
    
    if (!data || data.length === 0) {
      console.log("Nenhum estado encontrado, retornando dados mock");
      return [...mockStates];
    }
    
    console.log(`Encontrados ${data.length} estados`);
    return data as State[];
  } catch (error) {
    console.error("Erro ao buscar estados (try/catch):", error);
    console.log("Retornando dados mock para estados devido a exceção");
    return [...mockStates];
  }
};

// Buscar cidades por estado
export const fetchCitiesByState = async (stateId: string): Promise<City[]> => {
  try {
    if (!stateId) return [];
    
    console.log(`Buscando cidades para o estado ${stateId}`);
    const startTime = Date.now();
    
    const { data, error } = await supabase
      .from('cities')
      .select('*, states(*)')
      .eq('state_id', stateId)
      .order('name')
      .timeout(5000);
    
    console.log(`Tempo de resposta para cidades: ${Date.now() - startTime}ms`);
    
    if (error) {
      console.error("Erro ao buscar cidades:", error);
      
      // Mock data para casos de erro
      const mockCities = [
        { id: "1", name: "São Paulo", state_id: stateId },
        { id: "2", name: "Campinas", state_id: stateId },
        { id: "3", name: "Santos", state_id: stateId }
      ];
      
      return mockCities;
    }
    
    return data as City[];
  } catch (error) {
    console.error("Erro ao buscar cidades (try/catch):", error);
    return [];
  }
};

// Buscar condomínios por cidade
export const fetchCondominiumsByCity = async (cityId: string): Promise<Condominium[]> => {
  try {
    if (!cityId) return [];
    
    console.log(`Buscando condomínios para a cidade ${cityId}`);
    const startTime = Date.now();
    
    const { data, error } = await supabase
      .from('condominiums')
      .select('*, cities!inner(*, states(*))')
      .eq('city_id', cityId)
      .eq('approved', true)
      .order('name')
      .timeout(5000);
    
    console.log(`Tempo de resposta para condomínios: ${Date.now() - startTime}ms`);
    
    if (error) {
      console.error("Erro ao buscar condomínios:", error);
      
      // Mock data para casos de erro
      const mockCondominiums = [
        { id: "1", name: "Condomínio Parque das Flores", city_id: cityId, approved: true },
        { id: "2", name: "Condomínio Solar das Paineiras", city_id: cityId, approved: true },
        { id: "3", name: "Condomínio Recanto Verde", city_id: cityId, approved: true }
      ];
      
      return mockCondominiums;
    }
    
    // Ensure proper typing for nested objects
    const typedData = data?.map(condo => ({
      id: condo.id,
      name: condo.name,
      city_id: condo.city_id,
      address: condo.address,
      approved: condo.approved,
      cities: condo.cities ? {
        id: condo.cities.id,
        name: condo.cities.name,
        state_id: condo.cities.state_id,
        states: condo.cities.states
      } : undefined
    })) as Condominium[];
    
    return typedData || [];
  } catch (error) {
    console.error("Erro ao buscar condomínios (try/catch):", error);
    return [];
  }
};

// Sugerir um novo condomínio
export const suggestCondominium = async (
  cityId: string, 
  name: string, 
  address?: string
): Promise<string> => {
  const { data, error } = await supabase
    .rpc('suggest_condominium', {
      p_city_id: cityId,
      p_name: name,
      p_address: address || null
    });
  
  if (error) {
    console.error("Erro ao sugerir condomínio:", error);
    throw error;
  }
  
  return data as string;
};

// Buscar detalhes de localização por ids
export const fetchLocationDetailsById = async (
  stateId?: string,
  cityId?: string,
  condominiumId?: string
) => {
  try {
    const result: {
      state?: State;
      city?: City;
      condominium?: Condominium;
    } = {};

    if (stateId) {
      const { data: state } = await supabase
        .from('states')
        .select('*')
        .eq('id', stateId)
        .single();
      
      result.state = state as State;
    }

    if (cityId) {
      const { data: city } = await supabase
        .from('cities')
        .select('*, states(*)')
        .eq('id', cityId)
        .single();
      
      result.city = city as City;
    }

    if (condominiumId) {
      const { data: condominium } = await supabase
        .from('condominiums')
        .select('*, cities!inner(*, states(*))')
        .eq('id', condominiumId)
        .single();
      
      if (condominium) {
        result.condominium = {
          id: condominium.id,
          name: condominium.name,
          city_id: condominium.city_id,
          address: condominium.address,
          approved: condominium.approved,
          cities: condominium.cities ? {
            id: condominium.cities.id,
            name: condominium.cities.name,
            state_id: condominium.cities.state_id,
            states: condominium.cities.states
          } : undefined
        } as Condominium;
      }
    }

    return result;
  } catch (error) {
    console.error("Erro ao buscar detalhes de localização:", error);
    return {};
  }
};
