
import { supabase } from "@/integrations/supabase/client";
import { categories } from "@/constants/listings";

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

// Helper function to handle category mapping - rewritten for clarity
const normalizeCategoryValue = (category?: string): string | undefined => {
  if (!category) return undefined;
  
  // Debug logs to see what's happening
  console.log(`Normalizing category value: "${category}"`);
  
  // Direct mapping from ID to database value
  const categoryMapping: Record<string, string> = {
    'alimentos': 'Alimentos',
    'servicos': 'Serviços',
    'produtos': 'Produtos Gerais',
    'vagas': 'Vagas/Empregos'
  };
  
  // If we received a category ID, map it to its database name
  if (categoryMapping[category]) {
    console.log(`Found direct mapping: ${category} -> ${categoryMapping[category]}`);
    return categoryMapping[category];
  }
  
  // If it's already a valid category name, use it directly
  const validCategoryNames = Object.values(categoryMapping);
  if (validCategoryNames.includes(category)) {
    console.log(`Category "${category}" is already a valid name, using as-is`);
    return category;
  }
  
  // For legacy reasons, handle a few special cases
  const legacyMappings: Record<string, string> = {
    'serviço': 'Serviços',
    'servico': 'Serviços',
    'produto': 'Produtos Gerais'
  };
  
  if (legacyMappings[category]) {
    console.log(`Found legacy mapping: ${category} -> ${legacyMappings[category]}`);
    return legacyMappings[category];
  }
  
  // If we can't map it, return the original value as a fallback
  console.log(`No mapping found for "${category}", returning as-is`);
  return category;
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
    console.log(`Using normalized category for filter: "${normalizedCategory}"`);
    if (normalizedCategory) {
      query = query.eq("category", normalizedCategory);
    }
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
