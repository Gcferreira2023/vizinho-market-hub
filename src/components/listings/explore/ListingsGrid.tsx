
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import ListingCard from "../ListingCard";
import { supabase } from "@/integrations/supabase/client";
import { ListingStatus, mapStatusFromDB } from "../StatusBadge";
import { useMobile } from "@/hooks/useMobile";
import EmptyListingsState from "./EmptyListingsState";

interface ListingsGridProps {
  listings: any[];
  isLoading?: boolean;
  searchTerm?: string;
}

const ListingsGrid = ({ listings, isLoading = false, searchTerm = "" }: ListingsGridProps) => {
  const [loadedImages, setLoadedImages] = useState(0);
  const [condominiumDetails, setCondominiumDetails] = useState<Record<string, any>>({});
  const { user } = useAuth();
  const userCondominiumId = user?.user_metadata?.condominiumId;
  const isMobile = useMobile();
  
  useEffect(() => {
    // Log all listings for debugging
    console.log("ListingsGrid - Full listings data:", listings);
    if (listings.length > 0) {
      listings.forEach(listing => {
        console.log(`Listing ${listing.id} - Details:`, listing);
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
    // Adjust number of skeletons shown based on device
    const skeletonsCount = isMobile ? 4 : 8;
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
        {Array.from({ length: skeletonsCount }).map((_, index) => (
          <Skeleton key={index} className="h-[280px] md:h-[350px] rounded-lg" />
        ))}
      </div>
    );
  }

  // Se não há anúncios, mostrar mensagem de estado vazio
  if (listings.length === 0) {
    return <EmptyListingsState searchTerm={searchTerm} hasFilters={true} />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
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
};

export default ListingsGrid;
