
import { useEffect, useMemo, useRef } from "react";
import { ListingsFetchParams } from "./types";
import { useFetchEngine } from "./useFetchEngine";

/**
 * Hook that manages the lifecycle of fetching listings
 */
export function useFetchLifecycle(params: ListingsFetchParams) {
  // Track if we need to fetch data
  const shouldFetchRef = useRef(true);
  const prevParamsRef = useRef<string>("");
  
  // Get the core fetch functionality
  const {
    listings,
    isLoading,
    fetchData,
    resetError,
    retryCount,
    hasError,
    manualRetry,
    cleanup
  } = useFetchEngine(params);
  
  // Create a stable dependency array for the effect
  const paramsStr = useMemo(() => JSON.stringify({
    searchTerm: params.searchTerm,
    selectedCategory: params.selectedCategory,
    selectedType: params.selectedType,
    selectedStatus: params.selectedStatus,
    showSoldItems: params.showSoldItems,
    priceRange: params.priceRange,
    isCondominiumFilter: params.isCondominiumFilter,
    userCondominiumId: params.userCondominiumId,
    selectedStateId: params.selectedStateId,
    selectedCityId: params.selectedCityId,
    selectedCondominiumId: params.selectedCondominiumId,
    maxPrice: params.maxPrice
  }), [
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
    params.maxPrice
  ]);

  // Effect to fetch listings from database based on filters
  useEffect(() => {
    // Skip initial fetch if params haven't changed - avoid double fetch on mount
    if (prevParamsRef.current === paramsStr && !shouldFetchRef.current) {
      console.log("Skipping duplicate fetch with same params");
      return;
    }
    
    prevParamsRef.current = paramsStr;
    shouldFetchRef.current = false;
    
    // Reset error state on new filter params
    resetError();
    
    // Execute fetch or retry with delay based on retry count
    if (retryCount > 0) {
      // Exponential backoff for retries (1s, 2s, 4s)
      const retryDelay = Math.pow(2, retryCount - 1) * 1000;
      
      console.log(`Scheduling retry in ${retryDelay}ms`);
      const timerId = setTimeout(() => {
        fetchData();
      }, retryDelay);
      
      // Cleanup timer on unmount or filter change
      return () => clearTimeout(timerId);
    } else {
      // First attempt
      fetchData();
    }
    
    // Apply cleanup function when component unmounts
    return cleanup();
  }, [
    fetchData,
    retryCount,
    resetError,
    paramsStr,
    cleanup
  ]);

  return {
    listings,
    isLoading,
    hasError,
    retryLoadListings: manualRetry
  };
}
