
import { FC } from "react";
import MobileFilterSheet from "@/components/listings/explore/MobileFilterSheet";

interface ExploreHeaderProps {
  isFilterSheetOpen: boolean;
  setIsFilterSheetOpen: (isOpen: boolean) => void;
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
}

const ExploreHeader: FC<ExploreHeaderProps> = ({
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
  setPriceRange
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Explorar Anúncios</h1>
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
      />
    </div>
  );
};

export default ExploreHeader;
