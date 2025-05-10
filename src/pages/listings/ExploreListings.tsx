import Layout from "@/components/layout/Layout";
import SearchListingsForm from "@/components/listings/explore/SearchListingsForm";
import NotLoggedInAlert from "@/components/listings/explore/NotLoggedInAlert";
import ExploreContent from "@/components/listings/explore/ExploreContent";
import { useExploreListings } from "@/hooks/explore-listings";
import { Building, Filter, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMobile } from "@/hooks/useMobile";
import { Button } from "@/components/ui/button";
import MyCondominiumToggle from "@/components/listings/explore/MyCondominiumToggle";

const ExploreListings = () => {
  const isMobile = useMobile();
  const { 
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
    // Preço máximo dinâmico
    maxPrice,
    isMaxPriceLoading
  } = useExploreListings();

  // Helper functions to get location details for active filter badges
  const getStateName = () => {
    return selectedStateId ? "Estado selecionado" : null;
  };
  
  const getCityName = () => {
    return selectedCityId ? "Cidade selecionada" : null;
  };
  
  const getCondominiumName = () => {
    return selectedCondominiumId ? "Condomínio selecionado" : null;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Explorar Anúncios</h1>
          
          {/* Mobile Filter Button - Only displayed on mobile */}
          {isMobile && (
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setIsFilterSheetOpen(true)}
            >
              <Filter size={16} />
              Filtros
            </Button>
          )}
        </div>

        {/* Alert for non-logged in users */}
        {!isLoggedIn && <NotLoggedInAlert />}

        <SearchListingsForm
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
        />
        
        {/* Active filters display for quick feedback */}
        {(selectedStateId || selectedCityId || selectedCondominiumId || isCondominiumFilter || selectedCategory) && (
          <div className="flex flex-wrap gap-2 my-4">
            <span className="text-sm font-medium text-gray-500 self-center">Filtros ativos:</span>
            
            {selectedStateId && (
              <Badge variant="outline" className="flex items-center gap-1 bg-gray-100">
                <MapPin size={12} />
                {getStateName()}
              </Badge>
            )}
            
            {selectedCityId && (
              <Badge variant="outline" className="flex items-center gap-1 bg-gray-100">
                <MapPin size={12} />
                {getCityName()}
              </Badge>
            )}
            
            {selectedCondominiumId && (
              <Badge variant="outline" className="flex items-center gap-1 bg-gray-100">
                <Building size={12} />
                {getCondominiumName()}
              </Badge>
            )}
            
            {isCondominiumFilter && userCondominiumId && (
              <Badge variant="outline" className="flex items-center gap-1 bg-primary/20 text-primary">
                <Building size={12} />
                Meu Condomínio
              </Badge>
            )}
            
            {selectedCategory && (
              <Badge variant="outline" className="flex items-center gap-1 bg-gray-100">
                {selectedCategory}
              </Badge>
            )}
          </div>
        )}

        {/* Mobile Condominium Toggle - only when we have a user condominium */}
        {isMobile && userCondominiumId && (
          <div className="my-4">
            <div className="bg-primary/10 p-3 rounded-lg mb-4">
              <MyCondominiumToggle 
                isCondominiumFilter={isCondominiumFilter}
                onToggleCondominiumFilter={setIsCondominiumFilter}
              />
            </div>
          </div>
        )}

        <ExploreContent 
          listings={listings}
          isLoading={isLoading}
          searchTerm={searchTerm}
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
          selectedStateId={selectedStateId}
          setSelectedStateId={setSelectedStateId}
          selectedCityId={selectedCityId}
          setSelectedCityId={setSelectedCityId}
          selectedCondominiumId={selectedCondominiumId}
          setSelectedCondominiumId={setSelectedCondominiumId}
          isCondominiumFilter={isCondominiumFilter}
          setIsCondominiumFilter={setIsCondominiumFilter}
          maxPrice={maxPrice}
        />
      </div>
    </Layout>
  );
};

export default ExploreListings;
