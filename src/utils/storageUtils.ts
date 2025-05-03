
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
      
      // Before trying to create, verify if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error("Usuário não autenticado, não é possível criar bucket");
        return false;
      }
      
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
      
      console.log(`Bucket ${bucketName} criado com sucesso!`);
    } else {
      console.log(`Bucket ${bucketName} já existe.`);
    }
    
    return true;
  } catch (error) {
    console.error("Falha ao verificar/criar bucket de armazenamento:", error);
    console.error("Detalhes do erro:", JSON.stringify(error, null, 2));
    return false;
  }
};

// Helper to get public URL for an image
export const getPublicImageUrl = (bucket: string, path: string) => {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
};
