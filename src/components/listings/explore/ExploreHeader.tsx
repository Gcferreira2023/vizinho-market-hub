
import { FilterIcon, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingStatus } from "@/components/listings/StatusBadge";
import MobileFilterSheet from "./MobileFilterSheet";

interface ExploreHeaderProps {
  isFilterSheetOpen: boolean;
  setIsFilterSheetOpen: (isOpen: boolean) => void;
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
  // Location filters
  selectedStateId: string | null;
  setSelectedStateId: (stateId: string | null) => void;
  selectedCityId: string | null;
  setSelectedCityId: (cityId: string | null) => void;
  selectedCondominiumId: string | null;
  setSelectedCondominiumId: (condominiumId: string | null) => void;
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
  // Location filters
  selectedStateId,
  setSelectedStateId,
  selectedCityId,
  setSelectedCityId,
  selectedCondominiumId,
  setSelectedCondominiumId
}: ExploreHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Explorar Anúncios</h1>
          <p className="text-gray-600 mb-4">
            Encontre produtos e serviços em condomínios próximos a você
          </p>
        </div>

        <div className="flex gap-4">
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
            // Location filters
            selectedStateId={selectedStateId}
            setSelectedStateId={setSelectedStateId}
            selectedCityId={selectedCityId}
            setSelectedCityId={setSelectedCityId}
            selectedCondominiumId={selectedCondominiumId}
            setSelectedCondominiumId={setSelectedCondominiumId}
          />

          <div className="hidden md:block">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <MapPin size={16} />
              <span>Localização</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreHeader;
