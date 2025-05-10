
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { fetchListings } from "@/services/listings/listingService";
import { categoryMappings } from "@/constants/listings";

/**
 * Hook for fetching listings based on provided filters
 */
export function useListingsFetch({
  searchTerm,
  selectedCategory,
  selectedType,
  selectedStatus,
  showSoldItems,
  priceRange,
  isCondominiumFilter,
  userCondominiumId,
  selectedStateId,
  selectedCityId,
  selectedCondominiumId,
  maxPrice
}: {
  searchTerm: string;
  selectedCategory: string | null;
  selectedType: string | null;
  selectedStatus: string | null;
  showSoldItems: boolean;
  priceRange: [number, number];
  isCondominiumFilter: boolean;
  userCondominiumId: string | undefined;
  selectedStateId: string | null;
  selectedCityId: string | null;
  selectedCondominiumId: string | null;
  maxPrice: number | undefined;
}) {
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastError, setLastError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  // Effect to fetch listings from database based on filters
  useEffect(() => {
    // Reset error state on new filter params
    setLastError(null);
    
    const loadListings = async () => {
      setIsLoading(true);
      
      try {
        // Build search parameters based on selected filters
        const searchParams: any = {};
        console.log("Starting to build search parameters...");
        
        if (searchTerm) {
          searchParams.search = searchTerm;
          console.log(`Search term: "${searchTerm}"`);
        }
        
        if (selectedCategory) {
          searchParams.category = selectedCategory;
          console.log(`Category filter: "${selectedCategory}"`);
        }
        
        if (selectedType) {
          searchParams.type = selectedType;
          console.log(`Type filter: "${selectedType}"`);
        }
        
        if (selectedStatus) {
          // Convert from UI status to DB status
          if (selectedStatus === "disponível") searchParams.status = "active";
          else if (selectedStatus === "reservado") searchParams.status = "reserved";
          else if (selectedStatus === "vendido") searchParams.status = "sold";
          console.log(`Status filter: "${selectedStatus}" -> "${searchParams.status}"`);
        } else if (!showSoldItems) {
          searchParams.status = "active";
          console.log("Status filter: only active items (excluding sold)");
        }
        
        // Add location filters
        if (selectedStateId) {
          searchParams.stateId = selectedStateId;
          console.log(`State filter: "${selectedStateId}"`);
        }
        
        if (selectedCityId) {
          searchParams.cityId = selectedCityId;
          console.log(`City filter: "${selectedCityId}"`);
        }
        
        // Add condominium filter - either from location filter or user's filter
        if (selectedCondominiumId || (isCondominiumFilter && userCondominiumId)) {
          searchParams.condominiumId = selectedCondominiumId || userCondominiumId;
          console.log(`Condominium filter: "${searchParams.condominiumId}"`);
        }
        
        if (priceRange && (priceRange[0] !== 0 || priceRange[1] !== maxPrice)) {
          searchParams.priceRange = priceRange;
          console.log(`Price range filter: ${priceRange[0]} - ${priceRange[1]}`);
        }
        
        console.log("Search parameters built:", searchParams);
        console.log("Fetching listings...");
        
        const data = await fetchListings(searchParams);
        console.log(`Fetch successful: ${data.length} listings returned`);
        
        // If we got here, reset retry count on successful fetch
        setRetryCount(0);
        setListings(data || []);
        
        // Show toast for empty search results
        if (searchTerm && data.length === 0) {
          toast({
            title: "Nenhum resultado",
            description: `Não encontramos resultados para "${searchTerm}"`,
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
            searchTerm, 
            category: selectedCategory, 
            type: selectedType,
            status: selectedStatus
          } 
        });
        
        // Store the error for potential recovery
        setLastError(error instanceof Error ? error : new Error(String(error)));
        
        // Track retry attempts (max 3)
        const shouldRetry = retryCount < 3;
        if (shouldRetry) {
          console.log(`Retrying fetch (attempt ${retryCount + 1}/3)...`);
          setRetryCount(prev => prev + 1);
          
          // Show retry toast
          toast({
            title: "Tentando novamente",
            description: "Estamos tentando atualizar os anúncios novamente",
            duration: 3000
          });
          
          // Use empty array as fallback but don't clear previous results
          // This allows showing stale data instead of empty state during retries
          if (listings.length === 0) {
            setListings([]);
          }
        } else {
          // We've exhausted retries, show error and reset
          setListings([]);
          toast({
            title: "Erro ao carregar anúncios",
            description: "Não foi possível carregar os anúncios. Por favor, tente novamente mais tarde.",
            variant: "destructive"
          });
          setRetryCount(0);
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
    searchTerm, 
    selectedCategory, 
    selectedType, 
    selectedStatus, 
    showSoldItems, 
    priceRange, 
    isCondominiumFilter, 
    userCondominiumId, 
    selectedStateId,
    selectedCityId,
    selectedCondominiumId,
    toast,
    maxPrice,
    retryCount
  ]);

  // Expose function to manually retry loading after error
  const retryLoadListings = () => {
    if (lastError) {
      console.log("Manual retry requested by user");
      setRetryCount(1); // This will trigger the retry logic in the useEffect
    }
  };

  return {
    listings,
    isLoading,
    hasError: lastError !== null,
    retryLoadListings
  };
}
