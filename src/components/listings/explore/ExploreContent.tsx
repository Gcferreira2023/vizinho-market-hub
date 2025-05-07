
import { useState, useEffect } from "react";
import FilterSidebar from "./FilterSidebar";
import ListingsGrid from "./ListingsGrid";
import MobileFilterSheet from "../explore/mobile-filter/MobileFilterSheet";
import { Skeleton } from "@/components/ui/skeleton";
import { ListingStatus } from "@/components/listings/StatusBadge";
import EmptyListingsState from "./EmptyListingsState";

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
  // Preço máximo dinâmico
  maxPrice
}: ExploreContentProps) => {
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  return (
    <div className="flex gap-6 mt-6">
      {/* Filtro Lateral para Desktop */}
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

      {/* Conteúdo Principal com os Anúncios */}
      <div className="flex-1">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : listings.length > 0 ? (
          <ListingsGrid listings={listings} isLoading={isLoading} />
        ) : (
          <EmptyListingsState 
            searchTerm={searchTerm}
            hasFilters={!!(selectedCategory || selectedType || selectedStatus || 
              priceRange[0] > 0 || priceRange[1] < (maxPrice || 2000) ||
              selectedStateId || selectedCityId || selectedCondominiumId)}
            onResetFilters={resetFilters}
          />
        )}
      </div>

      {/* Modal de Filtros para Mobile */}
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
    </div>
  );
};

export default ExploreContent;
