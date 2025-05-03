
import { supabase } from "@/integrations/supabase/client";

// Ensure the storage bucket exists
export const ensureStorageBucket = async (bucketName: string) => {
  try {
    console.log(`Verificando se o bucket ${bucketName} existe...`);
    
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
        console.error("Detalhes do erro:", JSON.stringify(createError, null, 2));
        throw createError;
      }
      
      // After creating the bucket, update its permissions to public
      const { error: updateError } = await supabase
        .storage
        .updateBucket(bucketName, {
          public: true,
        });
        
      if (updateError) {
        console.error("Erro ao atualizar permissões do bucket:", updateError);
        console.error("Detalhes do erro:", JSON.stringify(updateError, null, 2));
        throw updateError;
      }
      
      console.log(`Bucket ${bucketName} criado com sucesso!`);
    } else {
      console.log(`Bucket ${bucketName} já existe.`);
      
      // Ensure the bucket is public even if it already exists
      const { error: updateError } = await supabase
        .storage
        .updateBucket(bucketName, {
          public: true,
        });
        
      if (updateError) {
        console.error("Erro ao atualizar permissões do bucket:", updateError);
        console.error("Detalhes do erro:", JSON.stringify(updateError, null, 2));
        throw updateError;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Falha ao verificar/criar bucket de armazenamento:", error);
    console.error("Detalhes do erro:", JSON.stringify(error, null, 2));
    throw error;
  }
};

// Helper to get public URL for an image
export const getPublicImageUrl = (bucket: string, path: string) => {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
};
