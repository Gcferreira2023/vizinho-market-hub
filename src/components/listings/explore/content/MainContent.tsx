
import LoadingSpinner from "@/components/ui/loading-spinner";
import ListingsGrid from "../ListingsGrid";
import EmptyListingsState from "../EmptyListingsState";

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
  // Debug logging
  console.log("MainContent received props:", { 
    listingsLength: listings?.length || 0, 
    isLoading, 
    hasError, 
    hasFilters 
  });
  
  return (
    <>
      {isLoading ? (
        <LoadingSpinner message="Carregando anúncios..." />
      ) : listings && listings.length > 0 ? (
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
