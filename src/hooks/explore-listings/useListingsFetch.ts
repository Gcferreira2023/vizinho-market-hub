
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
  const { toast } = useToast();

  // Effect to fetch listings from database based on filters
  useEffect(() => {
    const loadListings = async () => {
      setIsLoading(true);
      try {
        // Build search parameters based on selected filters
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
        
        // Add condominium filter - either from location filter or user's filter
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
    isLoading
  };
}
