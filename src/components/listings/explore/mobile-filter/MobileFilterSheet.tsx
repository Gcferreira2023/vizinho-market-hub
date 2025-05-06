
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { ListingStatus } from "@/components/listings/StatusBadge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Import our new components
import MobileLocationFilter from "../MobileLocationFilter";
import MyCondominiumToggle from "../MyCondominiumToggle";
import { MobileFilterCategory } from ".";
import { MobileFilterStatus } from ".";
import { MobileFilterType } from ".";
import { MobileFilterPrice } from ".";

interface MobileFilterSheetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
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

const MobileFilterSheet = ({
  isOpen,
  setIsOpen,
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
}: MobileFilterSheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 md:hidden">
          <Filter size={16} />
          Filtros
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
          <SheetDescription>
            Refine sua busca com os filtros abaixo
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] pr-2">
          {/* My Condominium Toggle */}
          <MyCondominiumToggle 
            isCondominiumFilter={isCondominiumFilter}
            onToggleCondominiumFilter={setIsCondominiumFilter}
          />

          {/* Location Filter */}
          <MobileLocationFilter
            selectedStateId={selectedStateId}
            setSelectedStateId={setSelectedStateId}
            selectedCityId={selectedCityId}
            setSelectedCityId={setSelectedCityId}
            selectedCondominiumId={selectedCondominiumId}
            setSelectedCondominiumId={setSelectedCondominiumId}
          />

          {/* Category Filter */}
          <MobileFilterCategory 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          {/* Status Filter */}
          <MobileFilterStatus
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            showSoldItems={showSoldItems}
            setShowSoldItems={setShowSoldItems}
          />

          {/* Type Filter */}
          <MobileFilterType
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />

          {/* Price Filter */}
          <MobileFilterPrice
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />

          <Button 
            className="w-full" 
            onClick={() => setIsOpen(false)}
          >
            Aplicar Filtros
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilterSheet;
