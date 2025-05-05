
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import ListingCard from "../ListingCard";
import { supabase } from "@/integrations/supabase/client";
import { ListingStatus, mapStatusFromDB } from "../StatusBadge";

interface ListingsGridProps {
  listings: any[];
  isLoading: boolean;
}

const ListingsGrid = ({ listings, isLoading }: ListingsGridProps) => {
  const [loadedImages, setLoadedImages] = useState(0);
  const [condominiumDetails, setCondominiumDetails] = useState<Record<string, any>>({});
  const { user } = useAuth();
  const userCondominiumId = user?.user_metadata?.condominiumId;
  
  useEffect(() => {
    // Log all listings for debugging
    console.log("ListingsGrid - Full listings data:", listings);
    if (listings.length > 0) {
      listings.forEach(listing => {
        const imageUrl = listing.ad_images && 
                        listing.ad_images.length > 0 ? 
                        listing.ad_images[0].image_url : 
                        '/placeholder.svg';
        console.log(`Explore listing ${listing.id}, Images:`, listing.ad_images, `Using URL: ${imageUrl}`);
      });
    }
  }, [listings]);
  
  useEffect(() => {
    // Fetch condominium info for listings if needed
    const fetchCondominiumData = async () => {
      const details: Record<string, any> = {};
      
      for (const listing of listings) {
        if (listing.condominium_id && !details[listing.condominium_id]) {
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
              .eq('id', listing.condominium_id)
              .single();
              
            if (!error && data) {
              details[listing.condominium_id] = data;
            }
          } catch (error) {
            console.error(`Error fetching condominium for listing ${listing.id}:`, error);
          }
        }
      }
      
      setCondominiumDetails(details);
    };
    
    if (listings.length > 0) {
      fetchCondominiumData();
    }
  }, [listings]);
  
  const handleImageLoad = () => {
    setLoadedImages(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-[350px] rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((listing) => {
        const condoInfo = condominiumDetails[listing.condominium_id];
        const isUserCondominium = userCondominiumId === listing.condominium_id;
        const condoName = condoInfo?.name || 
                          listing.condominiums?.name || 
                          "Não informado";
        
        // Get the city name if available
        const cityName = condoInfo?.cities?.name || listing.condominiums?.cities?.name || "";
        
        // For location display in card
        let location = "";
        if (listing.users) {
          location = listing.users.block ? `Bloco ${listing.users.block}` : "";
          if (listing.users.apartment) {
            location += location ? `, Ap ${listing.users.apartment}` : `Ap ${listing.users.apartment}`;
          }
        }
        
        // Get first image or use placeholder
        const imageUrl = listing.ad_images && 
                         listing.ad_images.length > 0 ? 
                         listing.ad_images[0].image_url : 
                         '/placeholder.svg';
        
        console.log(`Rendering listing ${listing.id} with image URL:`, imageUrl);
        
        return (
          <ListingCard
            key={listing.id}
            id={listing.id}
            title={listing.title}
            price={listing.price}
            imageUrl={imageUrl}
            category={listing.category}
            type={listing.type as "produto" | "serviço"}
            location={location}
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
};

export default ListingsGrid;
