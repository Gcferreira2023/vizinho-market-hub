
import { supabase } from "@/integrations/supabase/client";

// Verificar se o bucket existe
export const checkStorageBucket = async (): Promise<boolean> => {
  console.log("Verificando se o bucket 'ads' existe...");
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Erro ao verificar buckets:", error);
      return false;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === 'ads');
    console.log("Bucket 'ads' existe:", bucketExists);
    return bucketExists;
  } catch (error) {
    console.error("Erro ao verificar bucket:", error);
    return false;
  }
};

// Fazer upload de uma nova imagem
export const uploadImage = async (file: File, listingId: string, userId: string, position: number) => {
  try {
    // Verificar se o bucket existe
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'ads');
    
    if (!bucketExists) {
      throw new Error("O bucket de armazenamento 'ads' não está disponível");
    }
    
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
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    throw error;
  }
};

// Helper to get public URL for an image
export const getPublicImageUrl = (bucket: string, path: string) => {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
};
