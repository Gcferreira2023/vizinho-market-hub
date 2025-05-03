
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ListingCard from "@/components/listings/ListingCard";

interface SimilarListingsProps {
  currentListingId: string;
  category: string;
}

const SimilarListings = ({ currentListingId, category }: SimilarListingsProps) => {
  const [similarListings, setSimilarListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarListings = async () => {
      try {
        const { data: similarData, error: similarError } = await supabase
          .from('ads')
          .select('*')
          .neq('id', currentListingId)
          .eq('category', category)
          .limit(3);
          
        if (similarError) {
          console.error("Error fetching similar listings:", similarError);
        } else {
          setSimilarListings(similarData || []);
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

  if (similarListings.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Anúncios Similares</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {similarListings.map((listing) => (
          <ListingCard key={listing.id} {...listing} />
        ))}
      </div>
    </section>
  );
};

export default SimilarListings;
