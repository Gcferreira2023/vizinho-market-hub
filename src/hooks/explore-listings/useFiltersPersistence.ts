
import { useEffect } from "react";
import { ListingStatus } from "@/components/listings/StatusBadge";

/**
 * Hook for handling filter persistence in localStorage and URL params
 */
export function useFiltersPersistence({
  selectedStateId,
  setSelectedStateId,
  selectedCityId,
  setSelectedCityId,
  selectedCondominiumId,
  setSelectedCondominiumId,
  isCondominiumFilter,
  setIsCondominiumFilter,
  priceRange,
  setPriceRange,
  selectedCategory,
  setSelectedCategory,
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus,
  showSoldItems,
  setShowSoldItems,
  maxPrice,
  urlCondominiumId,
  urlSearchTerm,
  urlCategory,
  userCondominiumId
}: {
  selectedStateId: string | null;
  setSelectedStateId: (value: string | null) => void;
  selectedCityId: string | null;
  setSelectedCityId: (value: string | null) => void;
  selectedCondominiumId: string | null;
  setSelectedCondominiumId: (value: string | null) => void;
  isCondominiumFilter: boolean;
  setIsCondominiumFilter: (value: boolean) => void;
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  selectedCategory: string | null;
  setSelectedCategory: (value: string | null) => void;
  selectedType: string | null;
  setSelectedType: (value: string | null) => void;
  selectedStatus: ListingStatus | null;
  setSelectedStatus: (value: ListingStatus | null) => void;
  showSoldItems: boolean;
  setShowSoldItems: (value: boolean) => void;
  maxPrice: number | undefined;
  urlCondominiumId: string | null;
  urlSearchTerm: string | null;
  urlCategory: string | null;
  userCondominiumId: string | undefined;
}) {
  // Save filter preferences to localStorage
  useEffect(() => {
    const saveFiltersToLocalStorage = () => {
      const filters = {
        selectedStateId,
        selectedCityId,
        selectedCondominiumId,
        isCondominiumFilter,
        priceRange,
        selectedCategory,
        selectedType,
        selectedStatus,
        showSoldItems
      };
      
      localStorage.setItem('listingFilters', JSON.stringify(filters));
    };
    
    saveFiltersToLocalStorage();
  }, [
    selectedStateId,
    selectedCityId,
    selectedCondominiumId,
    isCondominiumFilter,
    priceRange,
    selectedCategory,
    selectedType,
    selectedStatus,
    showSoldItems
  ]);

  // Load filter preferences from localStorage on component mount
  useEffect(() => {
    const loadFiltersFromLocalStorage = () => {
      const savedFilters = localStorage.getItem('listingFilters');
      
      if (savedFilters) {
        const filters = JSON.parse(savedFilters);
        
        // Don't override URL parameters with localStorage values
        if (!urlCondominiumId && !isCondominiumFilter) {
          setSelectedStateId(filters.selectedStateId);
          setSelectedCityId(filters.selectedCityId);
          setSelectedCondominiumId(filters.selectedCondominiumId);
          setIsCondominiumFilter(filters.isCondominiumFilter);
        }
        
        if (!urlSearchTerm && !urlCategory) {
          // Use o valor salvo apenas se estiver dentro do novo range máximo
          const savedPriceRange = filters.priceRange || [0, 2000];
          setPriceRange([
            savedPriceRange[0],
            Math.min(savedPriceRange[1], maxPrice || 2000)
          ]);
          
          setSelectedCategory(filters.selectedCategory);
          setSelectedType(filters.selectedType);
          setSelectedStatus(filters.selectedStatus);
          setShowSoldItems(filters.showSoldItems);
        }
      }
    };
    
    loadFiltersFromLocalStorage();
  }, [
    maxPrice, 
    urlSearchTerm,
    urlCondominiumId,
    urlCategory,
    isCondominiumFilter,
    setSelectedStateId,
    setSelectedCityId,
    setSelectedCondominiumId,
    setIsCondominiumFilter,
    setPriceRange,
    setSelectedCategory,
    setSelectedType,
    setSelectedStatus,
    setShowSoldItems
  ]);

  // Set user's condominium ID when filter is toggled
  useEffect(() => {
    if (isCondominiumFilter && userCondominiumId) {
      setSelectedCondominiumId(userCondominiumId);
    } else if (!isCondominiumFilter && selectedCondominiumId === userCondominiumId) {
      setSelectedCondominiumId(null);
    }
  }, [
    isCondominiumFilter,
    userCondominiumId,
    selectedCondominiumId,
    setSelectedCondominiumId
  ]);
}
