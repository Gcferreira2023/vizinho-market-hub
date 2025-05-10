
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { fetchListings } from "@/services/listings/listingService";
import { useListingsFilter } from "@/hooks/useListingsFilter";
import { useAuth } from "@/contexts/AuthContext";
import { ListingStatus } from "@/components/listings/StatusBadge";
import { categoryMappings } from "@/constants/listings";

export function useExploreListings() {
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Get URL parameters
  const urlStateId = queryParams.get("stateId");
  const urlCityId = queryParams.get("cityId");
  const urlCondominiumId = queryParams.get("condominiumId");
  const urlCategory = queryParams.get("category");

  const {
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
    // Novo valor dinâmico para preço máximo
    maxPrice,
    isMaxPriceLoading
  } = useListingsFilter([]);
  
  // Set initial values from URL params
  useEffect(() => {
    if (urlStateId) {
      setSelectedStateId(urlStateId);
    }
    
    if (urlCityId) {
      setSelectedCityId(urlCityId);
    }
    
    if (urlCondominiumId) {
      setSelectedCondominiumId(urlCondominiumId);
      setIsCondominiumFilter(true);
    }
    
    if (urlCategory) {
      setSelectedCategory(urlCategory);
      console.log(`Setting initial category from URL: ${urlCategory}`);
    }
  }, [urlStateId, urlCityId, urlCondominiumId, urlCategory]);
  
  // Efeito para buscar os anúncios do banco de dados
  useEffect(() => {
    const loadListings = async () => {
      setIsLoading(true);
      try {
        // Construir os parâmetros de busca com base nos filtros selecionados
        const searchParams: any = {};
        
        if (searchTerm) {
          searchParams.search = searchTerm;
        }
        
        if (selectedCategory) {
          searchParams.category = selectedCategory;
          console.log(`Applying category filter: ${selectedCategory}`);
        }
        
        if (selectedType) {
          searchParams.type = selectedType;
          console.log(`Applying type filter: ${selectedType}`);
        }
        
        if (selectedStatus) {
          // Convert from UI status to DB status
          if (selectedStatus === "disponível") searchParams.status = "active";
          else if (selectedStatus === "reservado") searchParams.status = "reserved";
          else if (selectedStatus === "vendido") searchParams.status = "sold";
          console.log(`Applying status filter: ${selectedStatus} -> ${searchParams.status}`);
        } else if (!showSoldItems) {
          searchParams.status = "active";
          console.log("Filtering out sold items");
        }
        
        // Add location filters
        if (selectedStateId) {
          searchParams.stateId = selectedStateId;
          console.log(`Filtering by state: ${selectedStateId}`);
        }
        
        if (selectedCityId) {
          searchParams.cityId = selectedCityId;
          console.log(`Filtering by city: ${selectedCityId}`);
        }
        
        // Add condominium filter - either from the location filter or from the user's filter
        if (selectedCondominiumId || (isCondominiumFilter && userCondominiumId)) {
          searchParams.condominiumId = selectedCondominiumId || userCondominiumId;
          console.log(`Filtering by condominium: ${searchParams.condominiumId}`);
        }
        
        if (priceRange && (priceRange[0] !== 0 || priceRange[1] !== maxPrice)) {
          searchParams.priceRange = priceRange;
          console.log(`Applying price range filter: ${priceRange[0]} - ${priceRange[1]}`);
        }
        
        console.log("Buscando anúncios com os filtros:", searchParams);
        
        const data = await fetchListings(searchParams);
        console.log(`Encontrados ${data.length} anúncios na busca`);
        setListings(data || []);
        
        if (searchTerm && data.length === 0) {
          toast({
            title: "Nenhum resultado",
            description: `Não encontramos resultados para "${searchTerm}"`,
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Erro ao buscar anúncios:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os anúncios",
          variant: "destructive"
        });
        setListings([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadListings();
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
    maxPrice
  ]);

  return {
    listings,
    isLoading,
    isLoggedIn,
    userCondominiumId,
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
    // Novo valor dinâmico para preço máximo
    maxPrice,
    isMaxPriceLoading
  };
}
