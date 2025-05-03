
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "../storage/storageService";

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

// Upload e salvar múltiplas imagens para um anúncio
export const uploadListingImages = async (images: File[], listingId: string, userId: string) => {
  if (images.length === 0) return;
  
  for (let i = 0; i < images.length; i++) {
    const file = images[i];
    console.log(`Enviando imagem ${i+1}/${images.length}`);
    
    try {
      // Upload da imagem
      const publicUrl = await uploadImage(file, listingId, userId, i);
      console.log("URL pública da imagem:", publicUrl);
      
      // Salvar referência da imagem
      await saveImageReference(listingId, publicUrl, i);
    } catch (error) {
      console.error(`Erro ao processar imagem ${i+1}:`, error);
      throw error;
    }
  }
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

// Excluir imagens que foram removidas
export const deleteRemovedImages = async (listingId: string, existingImageIds: string[]) => {
  const { error: deleteImagesError } = await supabase
    .from('ad_images')
    .delete()
    .eq('ad_id', listingId)
    .not('id', 'in', existingImageIds.length > 0 ? `(${existingImageIds.join(',')})` : '(-1)');
  
  if (deleteImagesError) throw deleteImagesError;
};
