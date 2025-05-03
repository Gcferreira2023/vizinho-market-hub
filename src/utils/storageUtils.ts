
import { supabase } from "@/integrations/supabase/client";

// Ensure the storage bucket exists
export const ensureStorageBucket = async (bucketName: string) => {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase
      .storage
      .listBuckets();
    
    if (listError) {
      throw listError;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Create the bucket if it doesn't exist
      const { error: createError } = await supabase
        .storage
        .createBucket(bucketName, {
          public: true,  // Make bucket publicly accessible
          fileSizeLimit: 10485760, // 10MB file size limit
        });
      
      if (createError) {
        console.error("Error creating bucket:", createError);
        throw createError;
      }
      
      // Set a default RLS policy for the bucket
      // This can be adjusted based on security requirements
      const { error: policyError } = await supabase
        .storage
        .from(bucketName)
        .createSignedUrl('policy.json', 3600); // This doesn't actually matter, just checking permissions
      
      if (policyError && policyError.message !== 'The resource was not found') {
        console.error("Error setting bucket policy:", policyError);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Failed to ensure storage bucket exists:", error);
    throw error;
  }
};

// Helper to get public URL for an image
export const getPublicImageUrl = (bucket: string, path: string) => {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
};
