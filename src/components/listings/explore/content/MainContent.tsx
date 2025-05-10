
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
  const prevLoadingRef = useRef(isLoading);
  
  // Add a stable rendering state to prevent flickering
  const [isStableLoading, setIsStableLoading] = useState(true);
  const [stableListings, setStableListings] = useState<any[]>([]);
  
  // Effect to stabilize loading state and prevent flickering
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    // Only update loading state if there's an actual change
    if (isLoading !== prevLoadingRef.current) {
      prevLoadingRef.current = isLoading;
      
      if (isLoading) {
        // Immediately show loading state
        setIsStableLoading(true);
      } else {
        // Delay hiding the loading state to prevent flicker
        timer = setTimeout(() => {
          setIsStableLoading(false);
          // Only update listings when loading is complete
          setStableListings(listings);
        }, 800); // Increased delay for more stability
      }
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading, listings]);
  
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
      ) : stableListings.length > 0 ? (
        <ListingsGrid listings={stableListings} />
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
