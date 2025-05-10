
import { ExploreFilters } from "@/types/filters";
import { useFiltersState } from "./useFiltersState";
import { useFiltersPersistence } from "./useFiltersPersistence";
import { usePriceRange } from "./usePriceRange";

/**
 * Hook for managing all filters related to listings exploration
 * @returns All filter-related state and functions
 */
export function useExploreFilters(): ExploreFilters {
  // Get all filter state and setters
  const filterState = useFiltersState();
  const {
    priceRange,
    setPriceRange,
    userCondominiumId,
    urlSearchTerm,
    urlCondominiumId,
    urlCategory,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    selectedStatus,
    setSelectedStatus,
    showSoldItems,
    setShowSoldItems,
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    isCondominiumFilter,
    setIsCondominiumFilter,
    selectedStateId,
    setSelectedStateId,
    selectedCityId,
    setSelectedCityId,
    selectedCondominiumId,
    setSelectedCondominiumId
  } = filterState;
  
  // Setup persistence (localStorage and URL params)
  useFiltersPersistence({
    ...filterState,
    maxPrice: undefined // This will be overridden by the usePriceRange hook
  });
  
  // Handle dynamic price range
  const { maxPrice, isMaxPriceLoading } = usePriceRange(priceRange, setPriceRange);

  const resetFilters = () => {
    setSearchTerm("");
    setPriceRange([0, maxPrice || 2000]);
    setSelectedCategory(null);
    setSelectedType(null);
    setSelectedStatus(null);
    setShowSoldItems(true);
    setIsCondominiumFilter(false);
    setSelectedStateId(null);
    setSelectedCityId(null);
    setSelectedCondominiumId(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // A busca é tratada através da URL e useEffect acima
  };

  return {
    // Search and price filters
    searchTerm,
    setSearchTerm,
    priceRange,
    setPriceRange,
    
    // Category and type filters
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    
    // Status filters
    selectedStatus,
    setSelectedStatus,
    showSoldItems, 
    setShowSoldItems,
    
    // Condominium filter
    isCondominiumFilter,
    setIsCondominiumFilter,
    userCondominiumId,
    
    // UI state
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    
    // Actions
    resetFilters,
    handleSearch,
    
    // Location filters
    selectedStateId,
    setSelectedStateId,
    selectedCityId,
    setSelectedCityId,
    selectedCondominiumId,
    setSelectedCondominiumId,
    
    // Dynamic maximum price
    maxPrice,
    isMaxPriceLoading
  };
}
