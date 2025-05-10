
import { supabase } from "@/integrations/supabase/client";
import { categories, categoryMappings } from "@/constants/listings";

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

// Helper function to handle category mapping - completely rewritten for better debugging
const normalizeCategoryValue = (category?: string): string | undefined => {
  if (!category) return undefined;
  
  console.log(`Category filter requested: "${category}"`);
  
  // Direct mapping between category ID in the UI and the database value
  if (categoryMappings.idToDb[category]) {
    const dbValue = categoryMappings.idToDb[category];
    console.log(`Using direct mapping: category ID "${category}" -> DB value "${dbValue}"`);
    return dbValue;
  }
  
  // In case the category is already a database value, just return it
  const allDBValues = Object.values(categoryMappings.idToDb);
  if (allDBValues.includes(category)) {
    console.log(`Category "${category}" is already a valid DB value, using as-is`);
    return category;
  }
  
  // If none of the above, log warning and use as-is
  console.log(`WARNING: No mapping found for category "${category}", using as-is`);
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
  stateId?: string;
  cityId?: string;
}) => {
  console.log("fetchListings called with params:", JSON.stringify(searchParams, null, 2));

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
    console.log(`Status filter applied: "${searchParams.status}"`);
  } else {
    query = query.eq("status", "active");
    console.log("Default status filter applied: active");
  }
  
  // Add category filter with proper mapping
  if (searchParams.category) {
    // Use the normalized category value
    const normalizedCategory = normalizeCategoryValue(searchParams.category);
    console.log(`Using normalized category for DB query: "${normalizedCategory}"`);
    
    if (normalizedCategory) {
      // Apply the category filter
      query = query.eq("category", normalizedCategory);
      console.log(`Applied category filter: category = "${normalizedCategory}"`);
    }
  }
  
  // Add type filter with better logging
  if (searchParams.type) {
    console.log(`Filtering by type: "${searchParams.type}"`);
    // Handle both "serviço" and "servico" variations
    if (searchParams.type === "serviço") {
      query = query.or("type.eq.serviço,type.eq.servico");
    } else {
      query = query.eq("type", searchParams.type);
    }
  }
  
  // Add condominium filter
  if (searchParams.condominiumId) {
    query = query.eq("condominium_id", searchParams.condominiumId);
    console.log(`Condominium filter applied: "${searchParams.condominiumId}"`);
  }
  
  // Add city filter - requires join through condominiums
  if (searchParams.cityId) {
    query = query.eq("condominiums.city_id", searchParams.cityId);
    console.log(`City filter applied: "${searchParams.cityId}"`);
  }
  
  // Add state filter - requires joins through condominiums and cities
  if (searchParams.stateId) {
    query = query.eq("condominiums.cities.state_id", searchParams.stateId);
    console.log(`State filter applied: "${searchParams.stateId}"`);
  }
  
  // Add text search filter
  if (searchParams.search && searchParams.search.trim() !== "") {
    const searchTerm = searchParams.search.trim().toLowerCase();
    query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    console.log(`Search filter applied: "${searchTerm}"`);
  }
  
  // Add price range filter
  if (searchParams.priceRange) {
    const [minPrice, maxPrice] = searchParams.priceRange;
    
    // Log the price range for debugging
    console.log(`Price filter applied: min=${minPrice}, max=${maxPrice}`);
    
    // Apply both min and max price constraints separately for clarity
    query = query.gte('price', minPrice);
    query = query.lte('price', maxPrice);
  }

  // Order by creation date (newest first)
  const { data, error } = await query.order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
  
  console.log(`Results found: ${data?.length || 0}`);
  if (data && data.length > 0) {
    console.log("First result:", data[0].title);
    console.log("Category of first result:", data[0].category);
    console.log("Type of first result:", data[0].type);
  } else {
    console.log("No results found with applied filters");
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
