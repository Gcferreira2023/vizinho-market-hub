
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { fetchListings } from "@/services/listings/listingService";
import { useListingsFilter } from "@/hooks/useListingsFilter";
import { useAuth } from "@/contexts/AuthContext";

export function useExploreListings() {
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const isLoggedIn = !!user;

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
    handleSearch
  } = useListingsFilter([]);
  
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
        }
        
        if (selectedType) {
          searchParams.type = selectedType;
        }
        
        if (selectedStatus) {
          searchParams.status = selectedStatus;
        } else if (!showSoldItems) {
          searchParams.status = "active";
        }
        
        // Adicionar filtro de condomínio se estiver ativado
        if (isCondominiumFilter && userCondominiumId) {
          searchParams.condominiumId = userCondominiumId;
        }
        
        if (priceRange && priceRange[0] !== 0 && priceRange[1] !== 500) {
          searchParams.priceRange = priceRange;
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
  }, [searchTerm, selectedCategory, selectedType, selectedStatus, showSoldItems, priceRange, isCondominiumFilter, userCondominiumId, toast]);

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
    handleSearch
  };
}
