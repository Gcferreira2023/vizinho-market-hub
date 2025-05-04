
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ListingStatus } from "@/components/listings/StatusBadge";

export function useListingsFilter(initialListings: any[] = []) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlSearchTerm = queryParams.get("search");

  const [searchTerm, setSearchTerm] = useState(urlSearchTerm || "");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ListingStatus | null>(null);
  const [showSoldItems, setShowSoldItems] = useState(true);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Atualiza o termo de pesquisa quando os parâmetros da URL mudam
  useEffect(() => {
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
    }
  }, [urlSearchTerm]);

  const resetFilters = () => {
    setSearchTerm("");
    setPriceRange([0, 500]);
    setSelectedCategory(null);
    setSelectedType(null);
    setSelectedStatus(null);
    setShowSoldItems(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // A busca é tratada através da URL e useEffect acima
  };

  return {
    searchTerm,
    setSearchTerm,
    priceRange,
    setPriceRange,
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    selectedStatus,
    setSelectedStatus,
    showSoldItems, 
    setShowSoldItems,
    filteredListings: initialListings, // Isso não é mais usado diretamente
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    resetFilters,
    handleSearch
  };
}
