
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ListingStatus, mapStatusFromDB } from "@/components/listings/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";

export function useListingsFilter(initialListings: any[] = []) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlSearchTerm = queryParams.get("search");
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState(urlSearchTerm || "");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ListingStatus | null>(null);
  const [showSoldItems, setShowSoldItems] = useState(true);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isCondominiumFilter, setIsCondominiumFilter] = useState(true);

  // Obter o ID do condomínio do usuário dos metadados
  const userCondominiumId = user?.user_metadata?.condominiumId;

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
    setIsCondominiumFilter(true);
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
    isCondominiumFilter,
    setIsCondominiumFilter,
    userCondominiumId,
    filteredListings: initialListings, // Isso não é mais usado diretamente
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    resetFilters,
    handleSearch
  };
}
