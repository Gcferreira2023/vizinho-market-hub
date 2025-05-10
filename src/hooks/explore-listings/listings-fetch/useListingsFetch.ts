
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { fetchListings } from "@/services/listings/listingService";
import { ListingsFetchParams, ListingsFetchResult } from "./types";
import { buildSearchParams } from "./buildSearchParams";
import { useRetry } from "./useRetry";

/**
 * Hook for fetching listings based on provided filters
 */
export function useListingsFetch(params: ListingsFetchParams): ListingsFetchResult {
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Get retry utilities
  const { 
    retryCount, 
    lastError, 
    handleError, 
    resetError, 
    manualRetry, 
    hasError 
  } = useRetry();

  // Effect to fetch listings from database based on filters
  useEffect(() => {
    // Reset error state on new filter params
    resetError();
    
    const loadListings = async () => {
      console.log("Starting to load listings with params:", params);
      setIsLoading(true);
      
      try {
        // Build search parameters based on selected filters
        const searchParams = buildSearchParams(params);
        console.log("Fetching listings with search params:", searchParams);
        
        const data = await fetchListings(searchParams);
        console.log(`Fetch successful: ${data.length} listings returned`);
        
        setListings(data || []);
        
        // Show toast for empty search results with search term
        if (params.searchTerm && data.length === 0) {
          toast({
            title: "Nenhum resultado",
            description: `Não encontramos resultados para "${params.searchTerm}"`,
            variant: "destructive"
          });
        }
      } catch (error) {
        // Enhanced error handling
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error fetching listings:", error);
        console.error("Error details:", { 
          message: errorMessage, 
          filters: { 
            searchTerm: params.searchTerm, 
            category: params.selectedCategory, 
            type: params.selectedType,
            status: params.selectedStatus
          } 
        });
        
        // Handle the error with the retry logic
        const isRetrying = handleError(error);
        
        // Use empty array as fallback but don't clear previous results
        // This allows showing stale data instead of empty state during retries
        if (!isRetrying && listings.length === 0) {
          setListings([]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    // Execute fetch or retry with delay based on retry count
    if (retryCount > 0) {
      // Exponential backoff for retries (1s, 2s, 4s)
      const retryDelay = Math.pow(2, retryCount - 1) * 1000;
      
      console.log(`Scheduling retry in ${retryDelay}ms`);
      const timerId = setTimeout(() => {
        loadListings();
      }, retryDelay);
      
      // Cleanup timer on unmount or filter change
      return () => clearTimeout(timerId);
    } else {
      // First attempt
      loadListings();
    }
  }, [
    params.searchTerm, 
    params.selectedCategory, 
    params.selectedType, 
    params.selectedStatus, 
    params.showSoldItems, 
    params.priceRange, 
    params.isCondominiumFilter, 
    params.userCondominiumId, 
    params.selectedStateId,
    params.selectedCityId,
    params.selectedCondominiumId,
    toast,
    params.maxPrice,
    retryCount,
    resetError,
    handleError,
    listings.length
  ]);

  return {
    listings,
    isLoading,
    hasError,
    retryLoadListings: manualRetry
  };
}
