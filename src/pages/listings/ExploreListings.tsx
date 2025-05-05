
import Layout from "@/components/layout/Layout";
import SearchListingsForm from "@/components/listings/explore/SearchListingsForm";
import CondominiumFilter from "@/components/listings/explore/CondominiumFilter";
import NotLoggedInAlert from "@/components/listings/explore/NotLoggedInAlert";
import ExploreHeader from "@/components/listings/explore/ExploreHeader";
import ExploreContent from "@/components/listings/explore/ExploreContent";
import { useExploreListings } from "@/hooks/useExploreListings";

const ExploreListings = () => {
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
    setSelectedCondominiumId
  } = useExploreListings();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <ExploreHeader 
          isFilterSheetOpen={isFilterSheetOpen}
          setIsFilterSheetOpen={setIsFilterSheetOpen}
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
          selectedStateId={selectedStateId}
          setSelectedStateId={setSelectedStateId}
          selectedCityId={selectedCityId}
          setSelectedCityId={setSelectedCityId}
          selectedCondominiumId={selectedCondominiumId}
          setSelectedCondominiumId={setSelectedCondominiumId}
        />

        {/* Alerta de não necessidade de cadastro */}
        {!isLoggedIn && <NotLoggedInAlert />}

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
        />
      </div>
    </Layout>
  );
};

export default ExploreListings;
