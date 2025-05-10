import { supabase } from "@/integrations/supabase/client";
import { City, Condominium, State } from "@/types/location";

// Buscar todos os estados
export const fetchStates = async (): Promise<State[]> => {
  try {
    const { data, error } = await supabase
      .from('states')
      .select('*')
      .order('name');
    
    if (error) {
      console.error("Erro ao buscar estados:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("Nenhum estado encontrado");
      return [];
    }
    
    return data as State[];
  } catch (error) {
    console.error("Erro ao buscar estados (try/catch):", error);
    // Return empty array instead of throwing error to prevent UI crash
    return [];
  }
};

// Buscar cidades por estado
export const fetchCitiesByState = async (stateId: string): Promise<City[]> => {
  try {
    if (!stateId) return [];
    
    const { data, error } = await supabase
      .from('cities')
      .select('*, states(*)')
      .eq('state_id', stateId)
      .order('name');
    
    if (error) {
      console.error("Erro ao buscar cidades:", error);
      throw error;
    }
    
    return data as City[];
  } catch (error) {
    console.error("Erro ao buscar cidades (try/catch):", error);
    return [];
  }
};

// Buscar condomínios por cidade
export const fetchCondominiumsByCity = async (cityId: string): Promise<Condominium[]> => {
  const { data, error } = await supabase
    .from('condominiums')
    .select('*, cities!inner(*, states(*))')
    .eq('city_id', cityId)
    .eq('approved', true)
    .order('name');
  
  if (error) {
    console.error("Erro ao buscar condomínios:", error);
    throw error;
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
  
  return typedData;
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
