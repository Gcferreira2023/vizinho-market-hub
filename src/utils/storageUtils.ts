
import { supabase } from "@/integrations/supabase/client";

// Ensure the storage bucket exists
export const ensureStorageBucket = async (bucketName: string) => {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase
      .storage
      .listBuckets();
    
    if (listError) {
      console.error("Erro ao listar buckets:", listError);
      throw listError;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log(`Bucket ${bucketName} não existe, criando...`);
      // Create the bucket if it doesn't exist
      const { error: createError } = await supabase
        .storage
        .createBucket(bucketName, {
          public: true,  // Make bucket publicly accessible
          fileSizeLimit: 10485760, // 10MB file size limit
        });
      
      if (createError) {
        console.error("Erro ao criar bucket:", createError);
        throw createError;
      }
      
      console.log(`Bucket ${bucketName} criado com sucesso!`);
    } else {
      console.log(`Bucket ${bucketName} já existe.`);
    }
    
    return true;
  } catch (error) {
    console.error("Falha ao verificar/criar bucket de armazenamento:", error);
    throw error;
  }
};

// Helper to get public URL for an image
export const getPublicImageUrl = (bucket: string, path: string) => {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
};
