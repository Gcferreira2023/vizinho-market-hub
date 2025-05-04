
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import ListingCard from "@/components/listings/ListingCard";
import LoadingSpinner from "@/components/ui/loading-spinner";
import EmptyListingsState from "./EmptyListingsState";
import { fetchListings } from "@/services/listings/listingService";

interface CategoryListingsProps {
  categoryId: string | undefined;
}

const CategoryListings = ({ categoryId }: CategoryListingsProps) => {
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const loadListings = async () => {
      setIsLoading(true);
      try {
        const data = await fetchListings({ 
          category: categoryId,
          status: "active"
        });
        
        setListings(data || []);
      } catch (error) {
        console.error("Erro ao carregar anúncios:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadListings();
  }, [categoryId]);

  if (isLoading) {
    return <LoadingSpinner message="Carregando anúncios..." />;
  }

  if (listings.length === 0) {
    return <EmptyListingsState />;
  }

  return (
    <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
      {listings.map((listing) => {
        const imageUrl = 
          listing.ad_images && 
          listing.ad_images.length > 0 ? 
          listing.ad_images[0].image_url : 
          '/placeholder.svg';
            
        return (
          <ListingCard
            key={listing.id}
            id={listing.id}
            title={listing.title}
            price={listing.price}
            imageUrl={imageUrl}
            category={listing.category}
            type={listing.type}
            location={`${listing.user_metadata?.block || ''} ${listing.user_metadata?.apartment || ''}`}
            status="disponível"
          />
        );
      })}
    </div>
  );
};

export default CategoryListings;
