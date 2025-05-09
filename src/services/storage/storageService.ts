
import { supabase } from "@/integrations/supabase/client";
import { ensureStorageBucket } from "@/utils/storageUtils";

// Verificar se o bucket existe
export const checkStorageBucket = async (): Promise<boolean> => {
  console.log("Verificando se o bucket 'ads' existe...");
  try {
    // Verificar se o bucket 'ads' existe
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Erro ao listar buckets:", error);
      return false;
    }
    
    // Verificar se o bucket 'ads' existe na lista
    const bucketExists = buckets.some(bucket => bucket.name === 'ads');
    console.log("Bucket 'ads' existe?", bucketExists);
    
    if (!bucketExists) {
      console.log("Tentando criar o bucket 'ads'...");
      try {
        // Tentar criar o bucket se ele não existir
        await ensureStorageBucket('ads');
        return true;
      } catch (error) {
        console.error("Falha ao tentar criar o bucket:", error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao verificar bucket:", error);
    return false;
  }
};

// Fazer upload de uma nova imagem
export const uploadImage = async (file: File, listingId: string, userId: string, position: number) => {
  try {
    // Verificar se o bucket existe
    const bucketExists = await checkStorageBucket();
    
    if (!bucketExists) {
      throw new Error("O bucket de armazenamento 'ads' não está disponível");
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}-${position}.${fileExt}`;
    const filePath = `ad-images/${listingId}/${fileName}`;
    
    console.log(`Iniciando upload da imagem para ${filePath}`);
    
    // Upload da imagem
    const { error: uploadError, data } = await supabase
      .storage
      .from('ads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (uploadError) {
      console.error("Erro ao fazer upload da imagem:", uploadError);
      console.error("Detalhes do erro:", JSON.stringify(uploadError, null, 2));
      throw uploadError;
    }
    
    console.log("Upload concluído com sucesso, obtendo URL pública...");
    
    // Obter URL pública
    const { data: urlData } = supabase
      .storage
      .from('ads')
      .getPublicUrl(filePath);
      
    console.log("URL pública obtida:", urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    throw error;
  }
};

// Helper to get public URL for an image
export const getPublicImageUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  console.log(`Generated public URL for ${bucket}/${path}:`, data.publicUrl);
  return data.publicUrl;
};
