
import { Sheet } from "@/components/ui/sheet";
import MobileFilterSheet from "../mobile-filter";
import { ListingStatus } from "@/components/listings/StatusBadge";

interface MobileFilterWrapperProps {
  isFilterSheetOpen: boolean;
  setIsFilterSheetOpen: (open: boolean) => void;
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

const MobileFilterWrapper = ({
  isFilterSheetOpen,
  setIsFilterSheetOpen,
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
  isCondominiumFilter,
  setIsCondominiumFilter,
  selectedStateId,
  setSelectedStateId,
  selectedCityId,
  setSelectedCityId,
  selectedCondominiumId,
  setSelectedCondominiumId,
  maxPrice = 2000
}: MobileFilterWrapperProps) => {
  return (
    <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
      <MobileFilterSheet 
        isOpen={isFilterSheetOpen}
        setIsOpen={setIsFilterSheetOpen}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedStatus={selectedStatus as ListingStatus | null}
        setSelectedStatus={(status) => setSelectedStatus(status)}
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
    </Sheet>
  );
};

export default MobileFilterWrapper;
