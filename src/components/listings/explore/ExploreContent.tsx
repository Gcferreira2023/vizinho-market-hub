
import { ListingStatus } from "@/components/listings/StatusBadge";
import ListingsGrid from "./ListingsGrid";
import { FilterSidebar } from "./filter-sidebar";
import { MobileFilterSheet } from "./mobile-filter";

interface ExploreContentProps {
  listings: any[];
  isLoading: boolean;
  searchTerm?: string;
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
  // Location filter props
  selectedStateId: string | null;
  setSelectedStateId: (stateId: string | null) => void;
  selectedCityId: string | null;
  setSelectedCityId: (cityId: string | null) => void;
  selectedCondominiumId: string | null;
  setSelectedCondominiumId: (condominiumId: string | null) => void;
  // Condominium filter toggle
  isCondominiumFilter: boolean;
  setIsCondominiumFilter: (isFiltered: boolean) => void;
  // Filter sheet (mobile)
  isFilterSheetOpen?: boolean;
  setIsFilterSheetOpen?: (isOpen: boolean) => void;
  // Dynamic max price
  maxPrice?: number; 
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
  // Location filter props
  selectedStateId,
  setSelectedStateId,
  selectedCityId,
  setSelectedCityId,
  selectedCondominiumId,
  setSelectedCondominiumId,
  // Condominium filter toggle
  isCondominiumFilter,
  setIsCondominiumFilter,
  // Filter sheet (mobile)
  isFilterSheetOpen = false,
  setIsFilterSheetOpen = () => {},
  // Dynamic max price
  maxPrice
}: ExploreContentProps) => {
  return (
    <div className="flex flex-row gap-6">
      {/* Filter Sidebar (Desktop) */}
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
      
      {/* Mobile Filter Sheet */}
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
      
      {/* Listings Grid */}
      <div className="flex-1">
        <ListingsGrid 
          listings={listings} 
          isLoading={isLoading}
          searchTerm={searchTerm || ""}
        />
      </div>
    </div>
  );
};

export default ExploreContent;
