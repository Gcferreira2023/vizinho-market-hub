
import LoadingSpinner from "@/components/ui/loading-spinner";
import ListingsGrid from "../ListingsGrid";
import EmptyListingsState from "../EmptyListingsState";
import { useEffect, useState } from "react";

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
  // Add a stable rendering state to prevent flickering
  const [isStableLoading, setIsStableLoading] = useState(true);
  
  // Use this effect to stabilize loading state changes
  // which helps prevent UI flickering during filter changes
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isLoading) {
      // Immediately show loading state
      setIsStableLoading(true);
    } else {
      // Delay hiding the loading state slightly to prevent flicker
      timer = setTimeout(() => {
        setIsStableLoading(false);
      }, 300);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading]);
  
  // Log filtering info for debugging
  console.log(`MainContent rendering with ${listings.length} listings, isLoading: ${isLoading}, hasFilters: ${hasFilters}, stableLoading: ${isStableLoading}`);
  
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
