
import FilterSidebar from "../filter-sidebar";
import { ListingStatus } from "@/components/listings/StatusBadge";

interface DesktopSidebarProps {
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

const DesktopSidebar = ({
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
}: DesktopSidebarProps) => {
  return (
    <div className="hidden md:block">
      <FilterSidebar 
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
    </div>
  );
};

export default DesktopSidebar;
