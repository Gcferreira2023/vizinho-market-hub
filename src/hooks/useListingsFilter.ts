
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ListingStatus, mapStatusFromDB } from "@/components/listings/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useMaxPrice } from "./useMaxPrice";

export function useListingsFilter(initialListings: any[] = []) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlSearchTerm = queryParams.get("search");
  const urlCondominiumId = queryParams.get("condominiumId");
  const { user } = useAuth();

  // Buscar o preço máximo do banco de dados
  const { maxPrice: dynamicMaxPrice, loading: maxPriceLoading } = useMaxPrice(2000);
  
  const [searchTerm, setSearchTerm] = useState(urlSearchTerm || "");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ListingStatus | null>(null);
  const [showSoldItems, setShowSoldItems] = useState(true);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isCondominiumFilter, setIsCondominiumFilter] = useState(urlCondominiumId ? true : false);
  
  // Location filters
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [selectedCondominiumId, setSelectedCondominiumId] = useState<string | null>(urlCondominiumId);

  // Obter o ID do condomínio do usuário dos metadados
  const userCondominiumId = user?.user_metadata?.condominiumId;

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
    
    if (urlCondominiumId) {
      setSelectedCondominiumId(urlCondominiumId);
      setIsCondominiumFilter(true);
    }
  }, [urlSearchTerm, urlCondominiumId]);

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
        
        if (!urlSearchTerm) {
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
  }, [dynamicMaxPrice]);

  // Set user's condominium ID when filter is toggled
  useEffect(() => {
    if (isCondominiumFilter && userCondominiumId) {
      setSelectedCondominiumId(userCondominiumId);
    } else if (!isCondominiumFilter && selectedCondominiumId === userCondominiumId) {
      setSelectedCondominiumId(null);
    }
  }, [isCondominiumFilter, userCondominiumId]);

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
    searchTerm,
    setSearchTerm,
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
    isCondominiumFilter,
    setIsCondominiumFilter,
    userCondominiumId,
    filteredListings: initialListings, // Isso não é mais usado diretamente
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    resetFilters,
    handleSearch,
    // Location filters
    selectedStateId,
    setSelectedStateId,
    selectedCityId,
    setSelectedCityId,
    selectedCondominiumId,
    setSelectedCondominiumId,
    // Novo valor dinâmico de preço máximo
    maxPrice: dynamicMaxPrice,
    isMaxPriceLoading: maxPriceLoading
  };
}
