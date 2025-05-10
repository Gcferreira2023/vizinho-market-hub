
import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { fetchListings } from "@/services/listings/listingService";
import { buildSearchParams } from "./buildSearchParams";
import { useRetry } from "./useRetry";
import { ListingsFetchParams } from "./types";

/**
 * Hook that contains the core fetch functionality for listings
 */
export function useFetchEngine(params: ListingsFetchParams) {
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

  // Memoize the fetch function to avoid unnecessary re-renders
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    console.log("Starting to load listings with params:", JSON.stringify(params, null, 2));
    
    try {
      // Build search parameters based on selected filters
      const searchParams = buildSearchParams(params);
      console.log("Fetching listings with search params:", JSON.stringify(searchParams, null, 2));
      
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
      handleError(error);
    } finally {
      // Only set loading to false after a minimum delay to prevent flickering
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [
    params,
    toast,
    handleError
  ]);

  return {
    listings,
    isLoading,
    fetchData,
    resetError,
    retryCount,
    hasError,
    manualRetry
  };
}
