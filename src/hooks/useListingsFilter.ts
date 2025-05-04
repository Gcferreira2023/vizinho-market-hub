
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ListingStatus } from "@/components/listings/StatusBadge";

interface Listing {
  id: string;
  title: string;
  price: number | string;
  imageUrl: string;
  category: string;
  type: "produto" | "serviço";
  rating?: number;
  location: string;
  status: ListingStatus;
}

interface UseListingsFilterReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
  selectedStatus: ListingStatus | null;
  setSelectedStatus: (status: ListingStatus | null) => void;
  showSoldItems: boolean;
  setShowSoldItems: (show: boolean) => void;
  filteredListings: Listing[];
  isFilterSheetOpen: boolean;
  setIsFilterSheetOpen: (isOpen: boolean) => void;
  resetFilters: () => void;
  handleSearch: (e: React.FormEvent) => void;
}

export function useListingsFilter(allListings: Listing[]): UseListingsFilterReturn {
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

  // Update search term when URL parameters change
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
    // Search is handled through the URL and useEffect above
  };

  // Filter listings based on current filters
  const filteredListings = allListings.filter((listing) => {
    // Filtro por termo de pesquisa
    if (
      searchTerm &&
      !listing.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Filtro por categoria
    if (selectedCategory && listing.category !== selectedCategory) {
      return false;
    }

    // Filtro por tipo
    if (selectedType && listing.type !== selectedType) {
      return false;
    }

    // Filtro por status
    if (selectedStatus && listing.status !== selectedStatus) {
      return false;
    }
    
    // Opção de esconder itens vendidos
    if (!showSoldItems && listing.status === "vendido") {
      return false;
    }

    // Filtro por preço (ignora items com preço "A combinar")
    if (
      typeof listing.price === "number" &&
      (listing.price < priceRange[0] || listing.price > priceRange[1])
    ) {
      return false;
    }

    return true;
  });

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
    filteredListings,
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    resetFilters,
    handleSearch
  };
}
