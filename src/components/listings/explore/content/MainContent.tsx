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
  
  // Simplify loading state management to fix flickering and stuck loading issues
  const [isStableLoading, setIsStableLoading] = useState(isLoading);

  // Update stable loading state with a short delay to prevent flicker but ensure updates
  useEffect(() => {
    // For initial load or when loading starts, update immediately
    if (isLoading) {
      setIsStableLoading(true);
      return;
    }
    
    // When loading completes, add a small delay before updating UI
    const timer = setTimeout(() => {
      setIsStableLoading(false);
    }, 300);
    
    return () => {
      clearTimeout(timer);
    };
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
      {isStableLoading ? (
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
