
import FilterSidebar from "./FilterSidebar";
import ListingsGrid from "./ListingsGrid";
import EmptyListingsState from "./EmptyListingsState";
import { ListingStatus } from "@/components/listings/StatusBadge";

interface ExploreContentProps {
  listings: any[];
  isLoading: boolean;
  searchTerm: string;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
  selectedStatus: ListingStatus | null;
  setSelectedStatus: (status: ListingStatus | null) => void;
  showSoldItems: boolean;
  setShowSoldItems: (show: boolean) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  resetFilters: () => void;
  // Location filters
  selectedStateId: string | null;
  setSelectedStateId: (stateId: string | null) => void;
  selectedCityId: string | null;
  setSelectedCityId: (cityId: string | null) => void;
  selectedCondominiumId: string | null;
  setSelectedCondominiumId: (condominiumId: string | null) => void;
}

const ExploreContent = ({
  listings,
  isLoading,
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
  // Location filters
  selectedStateId,
  setSelectedStateId,
  selectedCityId,
  setSelectedCityId,
  selectedCondominiumId,
  setSelectedCondominiumId
}: ExploreContentProps) => {
  return (
    <div className="flex gap-6">
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
        // Location filters
        selectedStateId={selectedStateId}
        setSelectedStateId={setSelectedStateId}
        selectedCityId={selectedCityId}
        setSelectedCityId={setSelectedCityId}
        selectedCondominiumId={selectedCondominiumId}
        setSelectedCondominiumId={setSelectedCondominiumId}
      />

      <div className="flex-1">
        {listings.length === 0 && !isLoading ? (
          <EmptyListingsState 
            searchTerm={searchTerm} 
            onReset={resetFilters}
          />
        ) : (
          <ListingsGrid 
            listings={listings} 
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default ExploreContent;
