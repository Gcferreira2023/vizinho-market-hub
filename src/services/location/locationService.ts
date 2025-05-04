
import { supabase } from "@/integrations/supabase/client";
import { City, Condominium, State } from "@/types/location";

// Buscar todos os estados
export const fetchStates = async (): Promise<State[]> => {
  const { data, error } = await supabase
    .from('states')
    .select('*')
    .order('name');
  
  if (error) {
    console.error("Erro ao buscar estados:", error);
    throw error;
  }
  
  return data as State[];
};

// Buscar cidades por estado
export const fetchCitiesByState = async (stateId: string): Promise<City[]> => {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('state_id', stateId)
    .order('name');
  
  if (error) {
    console.error("Erro ao buscar cidades:", error);
    throw error;
  }
  
  return data as City[];
};

// Buscar condomínios por cidade
export const fetchCondominiumsByCity = async (cityId: string): Promise<Condominium[]> => {
  const { data, error } = await supabase
    .from('condominiums')
    .select('*')
    .eq('city_id', cityId)
    .eq('approved', true)
    .order('name');
  
  if (error) {
    console.error("Erro ao buscar condomínios:", error);
    throw error;
  }
  
  return data as Condominium[];
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
        .select('*')
        .eq('id', cityId)
        .single();
      
      result.city = city as City;
    }

    if (condominiumId) {
      const { data: condominium } = await supabase
        .from('condominiums')
        .select('*')
        .eq('id', condominiumId)
        .single();
      
      result.condominium = condominium as Condominium;
    }

    return result;
  } catch (error) {
    console.error("Erro ao buscar detalhes de localização:", error);
    return {};
  }
};
