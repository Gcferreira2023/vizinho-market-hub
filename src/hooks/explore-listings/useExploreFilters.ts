
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ListingStatus } from "@/components/listings/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useMaxPrice } from "../useMaxPrice";
import { ExploreFilters } from "@/types/filters";

/**
 * Hook for managing all filters related to listings exploration
 * @returns All filter-related state and functions
 */
export function useExploreFilters(): ExploreFilters {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlSearchTerm = queryParams.get("search");
  const urlCondominiumId = queryParams.get("condominiumId");
  const urlCategory = queryParams.get("category");
  const { user } = useAuth();
  
  // User condominium from metadata
  const userCondominiumId = user?.user_metadata?.condominiumId;

  // Buscar o preço máximo do banco de dados
  const { maxPrice: dynamicMaxPrice, loading: maxPriceLoading } = useMaxPrice(2000);
  
  // Search filters
  const [searchTerm, setSearchTerm] = useState(urlSearchTerm || "");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  
  // Category and type filters
  const [selectedCategory, setSelectedCategory] = useState<string | null>(urlCategory || null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  // Status filters
  const [selectedStatus, setSelectedStatus] = useState<ListingStatus | null>(null);
  const [showSoldItems, setShowSoldItems] = useState(true);
  
  // UI state
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  
  // Condominium filter
  const [isCondominiumFilter, setIsCondominiumFilter] = useState(urlCondominiumId ? true : false);
  
  // Location filters
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [selectedCondominiumId, setSelectedCondominiumId] = useState<string | null>(urlCondominiumId);

  // Atualiza o preço máximo quando o hook terminar de carregá-lo
  useEffect(() => {
    if (!maxPriceLoading && dynamicMaxPrice) {
      setPriceRange(prev => [prev[0], dynamicMaxPrice]);
      console.log(`Atualizando range de preço com máximo dinâmico: R$${dynamicMaxPrice}`);
    }
  }, [dynamicMaxPrice, maxPriceLoading]);

  // Atualiza o termo de pesquisa quando os parâmetros da URL mudam
  useEffect(() => {
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
    }
    
    if (urlCategory) {
      setSelectedCategory(urlCategory);
      console.log(`Setting initial category from URL: ${urlCategory}`);
    }
    
    if (urlCondominiumId) {
      setSelectedCondominiumId(urlCondominiumId);
      setIsCondominiumFilter(true);
    }
  }, [urlSearchTerm, urlCondominiumId, urlCategory]);

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
            Math.min(savedPriceRange[1], dynamicMaxPrice || 2000)
          ]);
          
          setSelectedCategory(filters.selectedCategory);
          setSelectedType(filters.selectedType);
          setSelectedStatus(filters.selectedStatus);
          setShowSoldItems(filters.showSoldItems);
        }
      }
    };
    
    loadFiltersFromLocalStorage();
  }, [dynamicMaxPrice, urlSearchTerm, urlCondominiumId, urlCategory]);

  // Set user's condominium ID when filter is toggled
  useEffect(() => {
    if (isCondominiumFilter && userCondominiumId) {
      setSelectedCondominiumId(userCondominiumId);
    } else if (!isCondominiumFilter && selectedCondominiumId === userCondominiumId) {
      setSelectedCondominiumId(null);
    }
  }, [isCondominiumFilter, userCondominiumId, selectedCondominiumId]);

  const resetFilters = () => {
    setSearchTerm("");
    setPriceRange([0, dynamicMaxPrice || 2000]);
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
    maxPrice: dynamicMaxPrice,
    isMaxPriceLoading: maxPriceLoading
  };
}
