
import { useState, useEffect, useCallback, memo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import ListingCard from "../ListingCard";
import { supabase } from "@/integrations/supabase/client";
import { mapStatusFromDB } from "../StatusBadge";
import { useMobile } from "@/hooks/useMobile";
import EmptyListingsState from "./EmptyListingsState";
import { categoryMappings } from "@/constants/listings";

interface ListingsGridProps {
  listings: any[];
  isLoading?: boolean;
  searchTerm?: string;
  resetFilters?: () => void;
}

// Memoize the component to prevent unnecessary re-renders
const ListingsGrid = memo(({ 
  listings, 
  isLoading = false, 
  searchTerm = "", 
  resetFilters 
}: ListingsGridProps) => {
  const [loadedImages, setLoadedImages] = useState(0);
  const [condominiumDetails, setCondominiumDetails] = useState<Record<string, any>>({});
  const { user } = useAuth();
  const userCondominiumId = user?.user_metadata?.condominiumId;
  const isMobile = useMobile();
  const listingsRef = useRef(listings);
  
  // Update ref when listings change
  useEffect(() => {
    listingsRef.current = listings;
  }, [listings]);
  
  // Memoize the image loading function
  const handleImageLoad = useCallback(() => {
    setLoadedImages(prev => prev + 1);
  }, []);
  
  // Reset loaded images counter when listings change
  useEffect(() => {
    setLoadedImages(0);
  }, [listings]);
  
  // Fetch condominium info for listings if needed
  useEffect(() => {
    // Skip if no listings or already loaded all needed info
    if (listings.length === 0) return;
    
    const fetchCondominiumData = async () => {
      // Only fetch for listings we don't already have info for
      const listingsToFetch = listings.filter(
        listing => listing.condominium_id && !condominiumDetails[listing.condominium_id]
      );
      
      if (listingsToFetch.length === 0) return;
      
      const details = {...condominiumDetails};
      
      // Group by condominium ID to reduce number of queries
      const condominiumIds = [...new Set(listingsToFetch.map(l => l.condominium_id))];
      
      for (const condominiumId of condominiumIds) {
        if (!condominiumId || details[condominiumId]) continue;
        
        try {
          const { data, error } = await supabase
            .from('condominiums')
            .select(`
              name,
              cities (
                name,
                states (
                  name,
                  uf
                )
              )
            `)
            .eq('id', condominiumId)
            .single();
            
          if (!error && data) {
            details[condominiumId] = data;
          }
        } catch (error) {
          console.error(`Error fetching condominium data:`, error);
        }
      }
      
      setCondominiumDetails(details);
    };
    
    fetchCondominiumData();
  }, [listings, condominiumDetails]);
  
  if (isLoading) {
    // Adjust number of skeletons shown based on device
    const skeletonsCount = isMobile ? 4 : 8;
    
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
        {Array.from({ length: skeletonsCount }).map((_, index) => (
          <Skeleton key={index} className="h-[280px] md:h-[350px] rounded-lg" />
        ))}
      </div>
    );
  }

  // Show empty state if no listings are available
  if (listings.length === 0) {
    return <EmptyListingsState 
      searchTerm={searchTerm} 
      hasFilters={!!resetFilters}
      onResetFilters={resetFilters} 
    />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
      {listings.map((listing) => {
        const condoInfo = condominiumDetails[listing.condominium_id];
        const isUserCondominium = userCondominiumId === listing.condominium_id;
        const condoName = condoInfo?.name || 
                          listing.condominiums?.name || 
                          "Não informado";
        
        // For location display in card
        let location = "";
        if (listing.users) {
          location = listing.users.block ? `Bloco ${listing.users.block}` : "";
          if (listing.users.apartment) {
            location += location ? `, Ap ${listing.users.apartment}` : `Ap ${listing.users.apartment}`;
          }
        }
        
        // Get first image or use fallback
        let imageUrl = '/lovable-uploads/a761c01e-ede6-4e1b-b09e-cd61fdb6b0c6.png'; // Default fallback
        
        // Verify if ad_images exists and has content
        if (listing.ad_images && listing.ad_images.length > 0) {
          // Find first valid image
          const firstValidImage = listing.ad_images.find(
            (image: any) => image && image.image_url && image.image_url.trim() !== '' && image.image_url !== '/placeholder.svg'
          );
          
          if (firstValidImage) {
            imageUrl = firstValidImage.image_url;
          }
        }

        // Map DB category value to UI category ID if needed
        let categoryForDisplay = listing.category;
        if (listing.category && categoryMappings.dbToId[listing.category]) {
          categoryForDisplay = categoryMappings.dbToId[listing.category];
        }
        
        return (
          <ListingCard
            key={listing.id}
            id={listing.id}
            title={listing.title}
            price={listing.price}
            imageUrl={imageUrl}
            category={categoryForDisplay}
            type={listing.type as "produto" | "serviço"}
            location={location || condoName}
            status={mapStatusFromDB(listing.status as string)}
            viewCount={listing.viewCount || 0}
            condominiumName={condoName}
            isUserCondominium={isUserCondominium}
            lazyLoad={true}
            onImageLoad={handleImageLoad}
          />
        );
      })}
    </div>
  );
});

// Add displayName for debugging
ListingsGrid.displayName = "ListingsGrid";

export default ListingsGrid;

function useRef(listings: any[]): { current: any[]; } {
  const [ref] = useState({ current: listings });
  return ref;
}
