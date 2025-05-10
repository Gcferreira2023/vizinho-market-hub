
import { supabase } from "@/integrations/supabase/client";

// Buscar dados de um anúncio
export const fetchListing = async (listingId: string) => {
  const { data: adData, error: adError } = await supabase
    .from('ads')
    .select('*, price_upon_request')
    .eq('id', listingId)
    .single();
    
  if (adError) throw adError;
  
  return adData;
};

// Helper function to handle category mapping
const normalizeCategoryValue = (category?: string): string | undefined => {
  if (!category) return undefined;
  
  // Map UI category names to database values and vice versa
  const categoryMappings: Record<string, string> = {
    'Produtos Gerais': 'produtos',
    'produtos': 'produtos',
    'Alimentos': 'Alimentos',
    'Serviços': 'Serviços',
    'servicos': 'Serviços',
    'serviço': 'Serviços',
    'Vagas/Empregos': 'Vagas/Empregos'
  };
  
  return categoryMappings[category] || category;
};

// Buscar listagens com filtro de pesquisa
export const fetchListings = async (searchParams: {
  search?: string;
  category?: string;
  type?: string;
  status?: string;
  priceRange?: [number, number];
  condominiumId?: string; 
  stateId?: string;   // New: filter by state ID
  cityId?: string;    // New: filter by city ID
}) => {
  // Construct select query with joins to get location data
  let query = supabase
    .from("ads")
    .select(`
      *,
      price_upon_request,
      ad_images (*),
      users!ads_user_id_fkey (name, block, apartment),
      condominiums:condominium_id (
        name, 
        city_id,
        cities (
          name, 
          state_id,
          states (name, uf)
        )
      )
    `);

  // Add status filter (active by default)
  if (searchParams.status) {
    query = query.eq("status", searchParams.status);
  } else {
    query = query.eq("status", "active");
  }
  
  // Add category filter with proper mapping
  if (searchParams.category) {
    const normalizedCategory = normalizeCategoryValue(searchParams.category);
    console.log(`Filtering by category: ${searchParams.category} -> ${normalizedCategory}`);
    query = query.eq("category", normalizedCategory);
  }
  
  // Add type filter
  if (searchParams.type) {
    query = query.eq("type", searchParams.type);
  }
  
  // Add condominium filter
  if (searchParams.condominiumId) {
    query = query.eq("condominium_id", searchParams.condominiumId);
  }
  
  // Add city filter - requires join through condominiums
  if (searchParams.cityId) {
    query = query.eq("condominiums.city_id", searchParams.cityId);
  }
  
  // Add state filter - requires joins through condominiums and cities
  if (searchParams.stateId) {
    query = query.eq("condominiums.cities.state_id", searchParams.stateId);
  }
  
  // Add text search filter
  if (searchParams.search && searchParams.search.trim() !== "") {
    const searchTerm = searchParams.search.trim().toLowerCase();
    query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    console.log(`Buscando por: "${searchTerm}"`);
  }
  
  // Add price range filter - FIXED: Ensure proper price filtering
  if (searchParams.priceRange) {
    const [minPrice, maxPrice] = searchParams.priceRange;
    
    // Log the price range for debugging
    console.log(`Applying price filter: min=${minPrice}, max=${maxPrice}`);
    
    // Apply both min and max price constraints separately for clarity
    query = query.gte('price', minPrice);
    query = query.lte('price', maxPrice);
  }

  // Order by creation date (newest first)
  const { data, error } = await query.order("created_at", { ascending: false });
  
  if (error) {
    console.error("Erro ao buscar anúncios:", error);
    throw error;
  }
  
  console.log(`Resultados encontrados: ${data?.length || 0}`);
  if (data && data.length > 0) {
    console.log("Primeiro resultado:", data[0].title);
    console.log("Categoria do primeiro resultado:", data[0].category);
    console.log("Preço do primeiro resultado:", data[0].price);
  }
  
  return data || [];
};

// Fetch condominium information for a listing
export const fetchListingCondominium = async (listingId: string) => {
  const { data, error } = await supabase
    .from('ads')
    .select(`
      condominium_id,
      condominiums (
        name,
        cities (
          name,
          states (
            name,
            uf
          )
        )
      )
    `)
    .eq('id', listingId)
    .single();

  if (error) throw error;
  return data;
};
