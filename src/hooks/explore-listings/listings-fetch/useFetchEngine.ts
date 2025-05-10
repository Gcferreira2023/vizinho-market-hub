
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
  const fetchingRef = useRef(false);
  
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
    // Prevent concurrent fetches
    if (fetchingRef.current) {
      console.log("Fetch already in progress, skipping...");
      return;
    }
    
    fetchingRef.current = true;
    setIsLoading(true);
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
      if (isMountedRef.current) {
        handleError(error);
      }
    } finally {
      // Only set loading to false if component is still mounted
      if (isMountedRef.current) {
        // Minimum delay to prevent flickering
        setTimeout(() => {
          setIsLoading(false);
          fetchingRef.current = false;
        }, 500);
      } else {
        fetchingRef.current = false;
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
