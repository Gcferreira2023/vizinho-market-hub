import { useEffect } from "react";
import { Sheet } from "@/components/ui/sheet";
import ListingsGrid from "./ListingsGrid";
import FilterSidebar from "./filter-sidebar";
import EmptyListingsState from "./EmptyListingsState";
import LoadingSpinner from "@/components/ui/loading-spinner";
import MobileFilterSheet from "./mobile-filter";
import { ListingStatus } from "@/components/listings/StatusBadge";

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 mt-6">
      {/* Desktop sidebar filter */}
      <div className="hidden md:block">
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
      
      {/* Main content area */}
      <div>
        {isLoading ? (
          <LoadingSpinner message="Carregando anúncios..." />
        ) : listings.length > 0 ? (
          <ListingsGrid listings={listings} />
        ) : (
          <EmptyListingsState 
            searchTerm={searchTerm} 
            hasError={hasError}
            onRetry={retryLoadListings}
            onResetFilters={resetFilters} 
          />
        )}
      </div>
      
      {/* Mobile filter sheet */}
      <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
        <MobileFilterSheet 
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
          onClose={() => setIsFilterSheetOpen(false)}
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
      </Sheet>
    </div>
  );
};

export default ExploreContent;
