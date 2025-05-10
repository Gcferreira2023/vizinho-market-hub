
import { useState, useCallback, useRef } from "react";
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
  const isMountedRef = useRef(true);
  const previousParams = useRef<string>("");
  
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
    const currentParams = JSON.stringify(params);
    
    // Não definir loading como true se os parâmetros não mudaram
    // Isso evita o efeito de "piscar" quando os filtros não mudam
    if (currentParams !== previousParams.current) {
      setIsLoading(true);
      previousParams.current = currentParams;
    }
    
    console.log("Starting to load listings with params:", JSON.stringify(params, null, 2));
    
    try {
      // Build search parameters based on selected filters
      const searchParams = buildSearchParams(params);
      console.log("Fetching listings with search params:", JSON.stringify(searchParams, null, 2));
      
      const data = await fetchListings(searchParams);
      console.log(`Fetch successful: ${data.length} listings returned`);
      
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setListings(data || []);
        setIsLoading(false);
      
        // Show toast for empty search results with search term
        if (params.searchTerm && data.length === 0) {
          toast({
            title: "Nenhum resultado",
            description: `Não encontramos resultados para "${params.searchTerm}"`,
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
      
      // Handle the error with the retry logic
      if (isMountedRef.current) {
        handleError(error);
        setIsLoading(false); // Make sure we set loading to false even on error
      }
    }
  }, [
    params,
    toast,
    handleError
  ]);

  // Handle cleanup when component unmounts
  const cleanup = useCallback(() => {
    return () => {
      console.log("Cleanup function called");
      isMountedRef.current = false;
    };
  }, []);

  return {
    listings,
    isLoading,
    fetchData,
    resetError,
    retryCount,
    hasError,
    manualRetry,
    cleanup
  };
}
