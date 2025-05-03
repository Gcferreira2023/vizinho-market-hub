
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { ensureStorageBucket } from "@/utils/storageUtils";

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

// Verificar se o anúncio pertence ao usuário
export const checkListingOwnership = (adData: any, userId: string) => {
  return adData.user_id === userId;
};

// Buscar imagens de um anúncio
export const fetchListingImages = async (listingId: string) => {
  const { data: imageData, error: imageError } = await supabase
    .from('ad_images')
    .select('*')
    .eq('ad_id', listingId)
    .order('position');
    
  if (imageError) throw imageError;
  
  return imageData || [];
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

// Excluir imagens que foram removidas
export const deleteRemovedImages = async (listingId: string, existingImageIds: string[]) => {
  const { error: deleteImagesError } = await supabase
    .from('ad_images')
    .delete()
    .eq('ad_id', listingId)
    .not('id', 'in', existingImageIds.length > 0 ? `(${existingImageIds.join(',')})` : '(-1)');
  
  if (deleteImagesError) throw deleteImagesError;
};

// Fazer upload de uma nova imagem
export const uploadImage = async (file: File, listingId: string, userId: string, position: number) => {
  // Verificar e criar bucket se necessário
  await ensureStorageBucket('ads');

  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}-${position}.${fileExt}`;
  const filePath = `ad-images/${listingId}/${fileName}`;
  
  // Upload da imagem
  const { error: uploadError } = await supabase
    .storage
    .from('ads')
    .upload(filePath, file);
    
  if (uploadError) throw uploadError;
  
  // Obter URL pública
  const { data: urlData } = supabase
    .storage
    .from('ads')
    .getPublicUrl(filePath);
    
  return urlData.publicUrl;
};

// Salvar referência da imagem no banco
export const saveImageReference = async (listingId: string, imageUrl: string, position: number) => {
  const { error: imageError } = await supabase
    .from('ad_images')
    .insert({
      ad_id: listingId,
      image_url: imageUrl,
      position: position,
    });
    
  if (imageError) throw imageError;
};

// Excluir anúncio
export const deleteListing = async (listingId: string) => {
  const { error } = await supabase
    .from('ads')
    .delete()
    .eq('id', listingId);
    
  if (error) throw error;
};
