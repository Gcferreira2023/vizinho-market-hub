
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ListingCard from "@/components/listings/ListingCard";
import { useIsMobile } from "@/hooks/use-mobile";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface SimilarListingsProps {
  currentListingId: string;
  category: string;
}

const SimilarListings = ({ currentListingId, category }: SimilarListingsProps) => {
  const [similarListings, setSimilarListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchSimilarListings = async () => {
      try {
        setIsLoading(true);
        const { data: similarData, error: similarError } = await supabase
          .from('ads')
          .select('*, ad_images(image_url)')
          .neq('id', currentListingId)
          .eq('category', category)
          .limit(3);
          
        if (similarError) {
          console.error("Error fetching similar listings:", similarError);
        } else {
          // Process the data to include the first image for each listing
          const processedData = similarData?.map(listing => {
            const imageUrl = listing.ad_images && listing.ad_images.length > 0
              ? listing.ad_images[0].image_url
              : '/placeholder.svg';
              
            return {
              ...listing,
              imageUrl
            };
          }) || [];
          
          setSimilarListings(processedData);
        }
      } catch (error) {
        console.error("Error in similar listings fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (category) {
      fetchSimilarListings();
    }
  }, [currentListingId, category]);

  if (isLoading) {
    return (
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Anúncios Similares</h2>
        <LoadingSpinner message="Buscando anúncios similares..." className="py-8" />
      </section>
    );
  }

  if (similarListings.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Anúncios Similares</h2>
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
        {similarListings.map((listing) => (
          <ListingCard 
            key={listing.id} 
            id={listing.id}
            title={listing.title}
            price={listing.price}
            imageUrl={listing.imageUrl}
            category={listing.category}
            type={listing.type || "produto"}
            location={`Bloco ${listing.block || "?"}, ${listing.apartment || "?"}`}
            status={listing.status === "active" ? "disponível" : 
                   listing.status === "reserved" ? "reservado" : "vendido"}
          />
        ))}
      </div>
    </section>
  );
};

export default SimilarListings;
