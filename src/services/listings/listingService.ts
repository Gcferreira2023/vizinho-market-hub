
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
}) => {
  // Inicia a query básica
  let query = supabase
    .from("ads")
    .select(`
      *,
      ad_images (*)
    `);

  // Adiciona filtro por status (ativo por padrão)
  if (searchParams.status) {
    query = query.eq("status", searchParams.status);
  } else {
    query = query.eq("status", "active");
  }
  
  // Adiciona filtro por categoria se houver
  if (searchParams.category) {
    query = query.eq("category", searchParams.category);
  }
  
  // Adiciona filtro por tipo se houver
  if (searchParams.type) {
    query = query.eq("type", searchParams.type);
  }
  
  // Adiciona filtro de busca por texto se houver
  if (searchParams.search && searchParams.search.trim() !== "") {
    const searchTerm = searchParams.search.trim().toLowerCase();
    query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
  }
  
  // Adiciona filtro por faixa de preço se houver
  if (searchParams.priceRange) {
    const [minPrice, maxPrice] = searchParams.priceRange;
    query = query.gte('price', minPrice).lte('price', maxPrice);
  }

  // Ordena por data de criação (mais recentes primeiro)
  const { data, error } = await query.order("created_at", { ascending: false });
  
  if (error) {
    console.error("Erro ao buscar anúncios:", error);
    throw error;
  }
  
  return data || [];
};

// Criar um novo anúncio
export const createListing = async (formData: ListingFormData, userId: string): Promise<string> => {
  console.log("Inserindo anúncio com user_id:", userId);
  
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

// Re-exporting for backwards compatibility
export {
  checkStorageBucket,
  uploadListingImages,
  fetchListingImages,
  deleteRemovedImages,
  ensureUserExists,
  checkListingOwnership,
};
