
import { useEffect, useState } from "react";
import ListingCard from "@/components/listings/ListingCard";
import EmptyListingsState from "./EmptyListingsState";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { useToast } from "@/components/ui/use-toast";
import { Listing } from "@/types/listing";

interface ListingsGridProps {
  listings: Listing[];
  searchTerm?: string;
  isLoading?: boolean;
}

const ListingsGrid = ({ listings, searchTerm, isLoading = false }: ListingsGridProps) => {
  const [visibleListings, setVisibleListings] = useState<Listing[]>([]);
  const [hasLoadedImages, setHasLoadedImages] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Simulate gradual loading for better perceived performance
  useEffect(() => {
    if (!isLoading && listings.length > 0) {
      // Show first 6 listings immediately
      const initialBatch = listings.slice(0, 6);
      setVisibleListings(initialBatch);
      
      // Then load the rest with a small delay
      if (listings.length > 6) {
        const timer = setTimeout(() => {
          setVisibleListings(listings);
        }, 300);
        
        return () => clearTimeout(timer);
      }
    }
  }, [listings, isLoading]);

  // Track image loading status
  const handleImageLoaded = (listingId: string) => {
    setHasLoadedImages(prev => ({ ...prev, [listingId]: true }));
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  // Show empty state
  if (listings.length === 0) {
    return <EmptyListingsState searchTerm={searchTerm} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {visibleListings.map((listing) => (
        <ListingCard 
          key={listing.id}
          id={listing.id}
          title={listing.title}
          price={listing.price}
          imageUrl={listing.imageUrl || '/placeholder.svg'}
          category={listing.category}
          type={listing.type}
          status={listing.status}
          location={listing.location || ""}
          condominiumName={listing.condominiumName}
          isUserCondominium={listing.isUserCondominium}
          viewCount={listing.viewCount}
          lazyLoad={true}
          onImageLoad={() => handleImageLoaded(listing.id)}
        />
      ))}
    </div>
  );
};

export default ListingsGrid;
