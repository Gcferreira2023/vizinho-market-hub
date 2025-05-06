
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingStatus } from "@/components/listings/StatusBadge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  MobileFilterPrice,
  MobileFilterType,
  MobileFilterStatus,
  MobileFilterCategory,
  MobileFilterLocation
} from "./";
import MyCondominiumToggle from "../MyCondominiumToggle";

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
          {/* My Condominium Toggle - Made more prominent */}
          <div className="bg-primary/10 rounded-lg p-3 mb-4">
            <MyCondominiumToggle 
              isCondominiumFilter={isCondominiumFilter}
              onToggleCondominiumFilter={setIsCondominiumFilter}
            />
          </div>

          {/* Location Filter - Now using the dedicated component */}
          <MobileFilterLocation
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
            className="w-full mt-4" 
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
