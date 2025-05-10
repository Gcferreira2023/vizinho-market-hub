
import { ListingStatus } from "@/components/listings/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import LocationFilter from "../LocationFilter";
import MyCondominiumToggle from "../MyCondominiumToggle";
import { 
  FilterCategory, 
  FilterType, 
  FilterStatus, 
  FilterPrice, 
  FilterReset 
} from "./";

interface FilterSidebarProps {
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
  // Preço máximo dinâmico
  maxPrice?: number;
}

const FilterSidebar = ({
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
  // Preço máximo dinâmico
  maxPrice = 2000
}: FilterSidebarProps) => {
  const { user } = useAuth();
  const userCondominiumId = user?.user_metadata?.condominiumId;
  
  return (
    <div className="hidden md:block w-64 space-y-6">
      <div className="bg-white p-4 rounded-lg border space-y-5">
        <h3 className="font-semibold text-lg">Filtros</h3>

        {/* My Condominium Toggle - Made more prominent with background */}
        {userCondominiumId && (
          <div className="bg-primary/10 rounded-lg p-3 -mx-2">
            <MyCondominiumToggle 
              isCondominiumFilter={isCondominiumFilter}
              onToggleCondominiumFilter={setIsCondominiumFilter}
            />
          </div>
        )}

        {/* Location Filter */}
        <LocationFilter
          selectedStateId={selectedStateId}
          setSelectedStateId={setSelectedStateId}
          selectedCityId={selectedCityId}
          setSelectedCityId={setSelectedCityId}
          selectedCondominiumId={selectedCondominiumId}
          setSelectedCondominiumId={setSelectedCondominiumId}
        />

        {/* Category Filter */}
        <FilterCategory
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        
        {/* Status Filter */}
        <FilterStatus
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          showSoldItems={showSoldItems}
          setShowSoldItems={setShowSoldItems}
        />

        {/* Type Filter */}
        <FilterType
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />

        {/* Price Filter */}
        <FilterPrice
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          maxPrice={maxPrice}
        />

        {/* Reset Filters Button */}
        <FilterReset resetFilters={resetFilters} />
      </div>
    </div>
  );
};

export default FilterSidebar;
