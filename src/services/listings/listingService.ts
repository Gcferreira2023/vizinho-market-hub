
import { supabase } from "@/integrations/supabase/client";
import { ListingFormData } from "@/types/listing";
import { checkStorageBucket } from "../storage/storageService";
import { uploadListingImages, fetchListingImages, deleteRemovedImages } from "../images/imageService";
import { ensureUserExists, checkListingOwnership } from "../users/userService";

// Buscar dados de um anúncio
export const fetchListing = async (listingId: string) => {
  const { data: adData, error: adError } = await supabase
    .from('ads')
    .select('*')
    .eq('id', listingId)
    .single();
    
  if (adError) throw adError;
  
  return adData;
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
  
  // Add category filter
  if (searchParams.category) {
    query = query.eq("category", searchParams.category);
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
    console.log("Preço do primeiro resultado:", data[0].price);
  }
  
  return data || [];
};

// Criar um novo anúncio
export const createListing = async (formData: ListingFormData, userId: string): Promise<string> => {
  console.log("Inserindo anúncio com user_id:", userId);
  
  // Buscar o condomínio do usuário
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('condominium_id')
    .eq('id', userId)
    .single();
    
  if (userError) {
    console.error("Erro ao buscar dados do usuário:", userError);
    throw userError;
  }
  
  const condominiumId = userData?.condominium_id;
  
  const { data: adData, error: adError } = await supabase
    .from('ads')
    .insert({
      user_id: userId,
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      type: formData.type,
      availability: formData.availability,
      delivery: formData.delivery,
      delivery_fee: formData.delivery ? parseFloat(formData.deliveryFee) : null,
      payment_methods: formData.paymentMethods,
      condominium_id: condominiumId,
    })
    .select('id')
    .single();
  
  if (adError) {
    console.error("Erro ao inserir anúncio:", adError);
    throw adError;
  }
  
  console.log("Anúncio criado com ID:", adData.id);
  return adData.id;
};

// Atualizar dados do anúncio
export const updateListing = async (listingId: string, listingData: any) => {
  const { error: updateError } = await supabase
    .from('ads')
    .update({
      title: listingData.title,
      description: listingData.description,
      price: parseFloat(listingData.price),
      category: listingData.category,
      type: listingData.type,
      availability: listingData.availability,
      delivery: listingData.delivery,
      delivery_fee: listingData.delivery ? parseFloat(listingData.deliveryFee) : null,
      payment_methods: listingData.paymentMethods,
      updated_at: new Date().toISOString(),
    })
    .eq('id', listingId);
  
  if (updateError) throw updateError;
};

// Excluir anúncio
export const deleteListing = async (listingId: string) => {
  const { error } = await supabase
    .from('ads')
    .delete()
    .eq('id', listingId);
    
  if (error) throw error;
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

// Re-exporting for backwards compatibility
export {
  checkStorageBucket,
  uploadListingImages,
  fetchListingImages,
  deleteRemovedImages,
  ensureUserExists,
  checkListingOwnership,
};
