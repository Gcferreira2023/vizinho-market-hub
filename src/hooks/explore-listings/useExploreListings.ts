
import { useAuth } from "@/contexts/AuthContext";
import { useExploreFilters } from "./useExploreFilters";
import { useListingsFetch } from "./listings-fetch";

/**
 * Main hook for the Explore Listings page, combining filters and data fetching
 * @returns All the state and handlers needed for the Explore Listings page
 */
export function useExploreListings() {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  
  // Get all filters from the filters hook
  const filters = useExploreFilters();
  
  // Fetch listings based on the filters
  const { listings, isLoading, hasError, retryLoadListings } = useListingsFetch({
    searchTerm: filters.searchTerm,
    selectedCategory: filters.selectedCategory,
    selectedType: filters.selectedType,
    selectedStatus: filters.selectedStatus,
    showSoldItems: filters.showSoldItems,
    priceRange: filters.priceRange,
    isCondominiumFilter: filters.isCondominiumFilter,
    userCondominiumId: filters.userCondominiumId,
    selectedStateId: filters.selectedStateId,
    selectedCityId: filters.selectedCityId,
    selectedCondominiumId: filters.selectedCondominiumId,
    maxPrice: filters.maxPrice
  });

  return {
    // Auth state
    isLoggedIn,
    
    // Listings data
    listings,
    isLoading,
    hasError,
    retryLoadListings,
    
    // Forward all filter properties and methods
    ...filters
  };
}
