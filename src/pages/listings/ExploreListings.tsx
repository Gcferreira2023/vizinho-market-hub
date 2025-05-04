
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import FilterSidebar from "@/components/listings/explore/FilterSidebar";
import MobileFilterSheet from "@/components/listings/explore/MobileFilterSheet";
import SearchListingsForm from "@/components/listings/explore/SearchListingsForm";
import ListingsGrid from "@/components/listings/explore/ListingsGrid";
import CondominiumFilter from "@/components/listings/explore/CondominiumFilter";
import { useListingsFilter } from "@/hooks/useListingsFilter";
import { fetchListings } from "@/services/listings/listingService";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/use-toast";

const ExploreListings = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Explorar Anúncios</h1>
          <MobileFilterSheet
            isOpen={isFilterSheetOpen}
            setIsOpen={setIsFilterSheetOpen}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            showSoldItems={showSoldItems}
            setShowSoldItems={setShowSoldItems}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
        </div>

        <SearchListingsForm
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
        />
        
        {userCondominiumId && (
          <CondominiumFilter 
            isCondominiumFilter={isCondominiumFilter}
            onToggleCondominiumFilter={setIsCondominiumFilter}
          />
        )}

        <div className="flex flex-col md:flex-row gap-6">
          <FilterSidebar 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            showSoldItems={showSoldItems}
            setShowSoldItems={setShowSoldItems}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            resetFilters={resetFilters}
          />

          <div className="flex-1">
            {isLoading ? (
              <LoadingSpinner message="Carregando anúncios..." />
            ) : (
              <ListingsGrid 
                listings={listings.map(listing => {
                  // Preparar os dados do anúncio para o componente ListingCard
                  const imageUrl = 
                    listing.ad_images && 
                    listing.ad_images.length > 0 ? 
                    listing.ad_images[0].image_url : 
                    '/placeholder.svg';
                  
                  // Obtém informações do usuário (vendedor)  
                  const location = listing.users 
                    ? `${listing.users.block || ''} ${listing.users.apartment || ''}` 
                    : '';
                    
                  return {
                    id: listing.id,
                    title: listing.title,
                    price: listing.price,
                    imageUrl: imageUrl,
                    category: listing.category,
                    type: listing.type as "produto" | "serviço",
                    location: location.trim(),
                    status: listing.status === "active" ? "disponível" : 
                            listing.status === "reserved" ? "reservado" : "vendido"
                  };
                })}
                searchTerm={searchTerm} 
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExploreListings;
