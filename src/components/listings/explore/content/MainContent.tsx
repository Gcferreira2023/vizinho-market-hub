import LoadingSpinner from "@/components/ui/loading-spinner";
import ListingsGrid from "../ListingsGrid";
import EmptyListingsState from "../EmptyListingsState";
import { useEffect, useState, useRef } from "react";

interface MainContentProps {
  listings: any[];
  isLoading: boolean;
  hasError?: boolean;
  retryLoadListings?: () => void;
  searchTerm: string;
  resetFilters: () => void;
  hasFilters: boolean;
  maxPrice?: number;
}

const MainContent = ({
  listings,
  isLoading,
  hasError,
  retryLoadListings,
  searchTerm,
  resetFilters,
  hasFilters,
  maxPrice = 10000
}: MainContentProps) => {
  // Use refs to keep track of previous state to prevent unnecessary re-renders
  const prevListingsLengthRef = useRef(listings.length);
  
  // Simplified loading state management - no delay to make sure we show content faster
  const [isStableLoading, setIsStableLoading] = useState(isLoading);

  // Update loading state more directly to prevent stuck loading states
  useEffect(() => {
    console.log("Loading state changed:", isLoading);
    setIsStableLoading(isLoading);
  }, [isLoading]);
  
  // Log filtering info for debugging
  useEffect(() => {
    if (prevListingsLengthRef.current !== listings.length || isLoading) {
      console.log(`MainContent rendering with ${listings.length} listings, isLoading: ${isLoading}, hasFilters: ${hasFilters}, stableLoading: ${isStableLoading}`);
      prevListingsLengthRef.current = listings.length;
    }
  }, [listings.length, isLoading, hasFilters, isStableLoading]);
  
  return (
    <>
      {isLoading ? (
        <LoadingSpinner message="Carregando anúncios..." />
      ) : listings.length > 0 ? (
        <ListingsGrid listings={listings} />
      ) : (
        <EmptyListingsState 
          searchTerm={searchTerm} 
          hasError={hasError}
          onRetry={retryLoadListings}
          onResetFilters={resetFilters}
          hasFilters={hasFilters}
        />
      )}
    </>
  );
};

export default MainContent;
