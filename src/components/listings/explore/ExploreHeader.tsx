
import SearchListingsForm from "./SearchListingsForm";
import FilterSidebar from "./FilterSidebar";
import { ListingStatus } from "@/components/listings/StatusBadge";
import MobileFilterSheet from "./MobileFilterSheet";

interface ExploreHeaderProps {
  isFilterSheetOpen: boolean;
  setIsFilterSheetOpen: (open: boolean) => void;
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
}

const ExploreHeader = ({
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
  // Location filter props
  selectedStateId,
  setSelectedStateId,
  selectedCityId,
  setSelectedCityId,
  selectedCondominiumId,
  setSelectedCondominiumId,
  // Condominium filter toggle
  isCondominiumFilter,
  setIsCondominiumFilter
}: ExploreHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Explorar Anúncios</h1>
      
      <div className="flex flex-col md:flex-row gap-4 md:items-start">
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
          resetFilters={() => {
            setSelectedCategory(null);
            setSelectedType(null);
            setSelectedStatus(null);
            setShowSoldItems(false);
            setPriceRange([0, 500]);
            setSelectedStateId(null);
            setSelectedCityId(null);
            setSelectedCondominiumId(null);
            setIsCondominiumFilter(false);
          }}
          // Location filter props
          selectedStateId={selectedStateId}
          setSelectedStateId={setSelectedStateId}
          selectedCityId={selectedCityId}
          setSelectedCityId={setSelectedCityId}
          selectedCondominiumId={selectedCondominiumId}
          setSelectedCondominiumId={setSelectedCondominiumId}
          // Condominium filter toggle
          isCondominiumFilter={isCondominiumFilter}
          setIsCondominiumFilter={setIsCondominiumFilter}
        />
        
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Resultados</h2>
            
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
              // Location filter props
              selectedStateId={selectedStateId}
              setSelectedStateId={setSelectedStateId}
              selectedCityId={selectedCityId}
              setSelectedCityId={setSelectedCityId}
              selectedCondominiumId={selectedCondominiumId}
              setSelectedCondominiumId={setSelectedCondominiumId}
              // Condominium filter toggle
              isCondominiumFilter={isCondominiumFilter}
              setIsCondominiumFilter={setIsCondominiumFilter}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreHeader;
