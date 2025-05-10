
import Layout from "@/components/layout/Layout";
import SearchListingsForm from "@/components/listings/explore/SearchListingsForm";
import NotLoggedInAlert from "@/components/listings/explore/NotLoggedInAlert";
import ExploreContent from "@/components/listings/explore/ExploreContent";
import { useExploreListings } from "@/hooks/explore-listings";
import { useMobile } from "@/hooks/useMobile";
import { ListingStatus } from "@/components/listings/StatusBadge";
import MyCondominiumToggle from "@/components/listings/explore/MyCondominiumToggle";
import ActiveFilters from "@/components/listings/explore/ActiveFilters";
import ErrorAlert from "@/components/listings/explore/ErrorAlert";
import ExploreHeader from "@/components/listings/explore/ExploreHeader";

const ExploreListings = () => {
  const isMobile = useMobile();
  const { 
    listings,
    isLoading,
    hasError,
    retryLoadListings,
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header with title and mobile filter button */}
        <ExploreHeader 
          isMobile={isMobile}
          setIsFilterSheetOpen={setIsFilterSheetOpen}
        />

        {/* Alert for non-logged in users */}
        {!isLoggedIn && <NotLoggedInAlert />}

        {/* Show connectivity error alert if we have persistent errors */}
        {hasError && <ErrorAlert retryLoadListings={retryLoadListings} />}

        {/* Search form */}
        <SearchListingsForm
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
        />
        
        {/* Active filters display */}
        <ActiveFilters
          selectedStateId={selectedStateId}
          selectedCityId={selectedCityId}
          selectedCondominiumId={selectedCondominiumId}
          isCondominiumFilter={isCondominiumFilter}
          userCondominiumId={userCondominiumId}
          selectedCategory={selectedCategory}
        />

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

        {/* Main content with listings and filters */}
        <ExploreContent 
          listings={listings}
          isLoading={isLoading}
          hasError={hasError}
          retryLoadListings={retryLoadListings}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedStatus={selectedStatus}
          setSelectedStatus={(status) => setSelectedStatus(status as ListingStatus | null)}
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
          isFilterSheetOpen={isFilterSheetOpen}
          setIsFilterSheetOpen={setIsFilterSheetOpen}
        />
      </div>
    </Layout>
  );
};

export default ExploreListings;
