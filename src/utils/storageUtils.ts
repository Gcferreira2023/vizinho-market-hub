
import { supabase } from "@/integrations/supabase/client";

/**
 * Verify if a storage bucket exists, and create it if it doesn't
 */
export const ensureStorageBucket = async (bucketName: string) => {
  try {
    // Check if bucket exists
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) {
      console.error("Error checking buckets:", bucketsError);
      return false;
    }
    
    // If bucket doesn't exist, create it
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      const { error: createError } = await supabase
        .storage
        .createBucket(bucketName, {
          public: true // Make the bucket public so images are accessible
        });
        
      if (createError) {
        console.error("Error creating bucket:", createError);
        return false;
      }
      
      console.log(`Storage bucket ${bucketName} created successfully`);
    }
    
    return true;
  } catch (error) {
    console.error("Error ensuring storage bucket:", error);
    return false;
  }
};
