
import { supabase } from "@/integrations/supabase/client";
import { ensureStorageBucket } from "@/utils/storageUtils";

// Verificar se o bucket existe
export const checkStorageBucket = async (): Promise<boolean> => {
  console.log("Verificando se o bucket 'ads' existe...");
  try {
    // Tenta garantir que o bucket 'ads' exista
    const result = await ensureStorageBucket('ads');
    return result;
  } catch (error) {
    console.error("Erro ao verificar/criar bucket:", error);
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
    const { error: uploadError } = await supabase
      .storage
      .from('ads')
      .upload(filePath, file);
      
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
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
};
