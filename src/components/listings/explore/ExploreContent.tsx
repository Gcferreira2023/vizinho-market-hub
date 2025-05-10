
import { useEffect } from "react";
import { DesktopSidebar, MainContent, MobileFilterWrapper } from "./content";

interface ExploreContentProps {
  listings: any[];
  isLoading: boolean;
  hasError?: boolean;
  retryLoadListings?: () => void;
  searchTerm: string;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
  selectedStatus: string | null;
  setSelectedStatus: (status: string | null) => void;
  showSoldItems: boolean;
  setShowSoldItems: (show: boolean) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  resetFilters: () => void;
  isFilterSheetOpen?: boolean;
  setIsFilterSheetOpen?: (open: boolean) => void;
  isCondominiumFilter: boolean;
  setIsCondominiumFilter: (isFilter: boolean) => void;
  selectedStateId: string | null;
  setSelectedStateId: (stateId: string | null) => void;
  selectedCityId: string | null;
  setSelectedCityId: (cityId: string | null) => void;
  selectedCondominiumId: string | null;
  setSelectedCondominiumId: (condominiumId: string | null) => void;
  maxPrice?: number;
}

const ExploreContent: React.FC<ExploreContentProps> = ({
  listings,
  isLoading,
  hasError,
  retryLoadListings,
  searchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus,
  showSoldItems,
  setShowSoldItems,
  priceRange,
  setPriceRange,
  resetFilters,
  isFilterSheetOpen = false,
  setIsFilterSheetOpen = () => {},
  isCondominiumFilter,
  setIsCondominiumFilter,
  selectedStateId,
  setSelectedStateId,
  selectedCityId,
  setSelectedCityId,
  selectedCondominiumId,
  setSelectedCondominiumId,
  maxPrice = 10000
}) => {
  // Close mobile filter sheet when component unmounts
  useEffect(() => {
    return () => {
      setIsFilterSheetOpen(false);
    };
  }, [setIsFilterSheetOpen]);

  // Check if any filters are active
  const hasFilters = !!(
    selectedCategory || 
    selectedType || 
    selectedStatus || 
    selectedStateId || 
    selectedCityId || 
    selectedCondominiumId || 
    (priceRange[0] > 0 || priceRange[1] < maxPrice)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 mt-6">
      {/* Desktop sidebar filter */}
      <DesktopSidebar
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
        isCondominiumFilter={isCondominiumFilter}
        setIsCondominiumFilter={setIsCondominiumFilter}
        selectedStateId={selectedStateId}
        setSelectedStateId={setSelectedStateId}
        selectedCityId={selectedCityId}
        setSelectedCityId={setSelectedCityId}
        selectedCondominiumId={selectedCondominiumId}
        setSelectedCondominiumId={setSelectedCondominiumId}
        maxPrice={maxPrice}
      />
      
      {/* Main content area */}
      <div>
        <MainContent 
          listings={listings}
          isLoading={isLoading}
          hasError={hasError}
          retryLoadListings={retryLoadListings}
          searchTerm={searchTerm}
          resetFilters={resetFilters}
          hasFilters={hasFilters}
          maxPrice={maxPrice}
        />
      </div>
      
      {/* Mobile filter sheet */}
      <MobileFilterWrapper
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
        resetFilters={resetFilters}
        isCondominiumFilter={isCondominiumFilter}
        setIsCondominiumFilter={setIsCondominiumFilter}
        selectedStateId={selectedStateId}
        setSelectedStateId={setSelectedStateId}
        selectedCityId={selectedCityId}
        setSelectedCityId={setSelectedCityId}
        selectedCondominiumId={selectedCondominiumId}
        setSelectedCondominiumId={setSelectedCondominiumId}
        maxPrice={maxPrice}
      />
    </div>
  );
};

export default ExploreContent;
