
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format, differenceInDays } from "date-fns";
import { Listing as ListingType } from "@/types/listing";
import { ListingStatus } from "@/components/listings/StatusBadge";

// Interface for the listing statistics
export interface ListingStats {
  views: number;
  days: number;
  contacts: number;
}

// Re-export the Listing type from types/listing.ts
export type { ListingType as Listing };

export const useUserListings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userListings, setUserListings] = useState<ListingType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listingImages, setListingImages] = useState<Record<string, string>>({});
  const [listingStats, setListingStats] = useState<Record<string, ListingStats>>({});

  useEffect(() => {
    const fetchUserListings = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch user listings
        const { data: listings, error } = await supabase
          .from('ads')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        console.log("Listings fetched:", listings);
        
        if (listings) {
          // Transform raw data to include viewCount safely
          const listingsWithViewCount: ListingType[] = listings.map((listing: any) => ({
            id: listing.id,
            title: listing.title,
            description: listing.description,
            price: listing.price,
            category: listing.category,
            type: listing.type as "produto" | "serviço", // Ensure proper typing
            status: listing.status,
            viewCount: listing.viewCount || 0,
            created_at: listing.created_at
          }));
          
          setUserListings(listingsWithViewCount);
          
          // Calculate statistics for each listing
          const stats: Record<string, ListingStats> = {};
          
          listingsWithViewCount.forEach(listing => {
            const createdDate = new Date(listing.created_at || new Date());
            const daysSinceCreation = differenceInDays(new Date(), createdDate);
            
            stats[listing.id] = {
              views: listing.viewCount || 0,
              days: daysSinceCreation,
              // Simulate contacts based on views
              contacts: Math.floor((listing.viewCount || 0) * 0.3)
            };
          });
          
          setListingStats(stats);
        }
        
        // Fetch images for each listing
        if (listings && listings.length > 0) {
          const newImageMap: Record<string, string> = {};
          
          for (const listing of listings) {
            try {
              // Fetch images for this listing
              const { data: imageData, error: imgError } = await supabase
                .from('ad_images')
                .select('*')
                .eq('ad_id', listing.id)
                .order('position');
              
              if (imgError) {
                console.error(`Error fetching image for listing ${listing.id}:`, imgError);
                newImageMap[listing.id] = '/placeholder.svg';
                continue;
              }
              
              if (imageData && imageData.length > 0) {
                console.log(`Found images for listing ${listing.id}:`, imageData);
                newImageMap[listing.id] = imageData[0].image_url;
              } else {
                console.log(`No images found for listing ${listing.id}, using placeholder`);
                newImageMap[listing.id] = '/placeholder.svg';
              }
            } catch (error) {
              console.error("Error processing image for listing:", listing.id, error);
              newImageMap[listing.id] = '/placeholder.svg';
            }
          }
          
          console.log("Final image map:", newImageMap);
          setListingImages(newImageMap);
        }
      } catch (error: any) {
        console.error('Error fetching listings:', error);
        toast({
          title: "Error",
          description: "Could not load your listings",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserListings();
  }, [user, toast]);

  // Map status from English to Portuguese
  const translateStatus = (status: string): ListingStatus => {
    switch (status) {
      case "active":
        return "disponível";
      case "reserved":
        return "reservado";
      case "sold":
        return "vendido";
      default:
        return "disponível";
    }
  };

  // Format user location
  const userLocation = user?.user_metadata 
    ? `Bloco ${user.user_metadata.block || '-'}, Apt ${user.user_metadata.apartment || '-'}`
    : "Location not provided";
  
  // Calculate global statistics
  const totalViews = userListings.reduce((sum, listing) => sum + (listing.viewCount || 0), 0);
  const totalListings = userListings.length;
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "'Created on' dd 'of' MMMM", { locale: require('date-fns/locale/pt-BR') });
  };

  return {
    userListings,
    isLoading,
    listingImages,
    listingStats,
    translateStatus,
    userLocation,
    totalViews,
    totalListings,
    formatDate
  };
};
