
import { ListingStatus } from "@/components/listings/StatusBadge";

export interface ExploreFilters {
  // Search and price filters
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  
  // Category and type filters
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
  
  // Status filters
  selectedStatus: ListingStatus | null;
  setSelectedStatus: (status: ListingStatus | null) => void;
  showSoldItems: boolean;
  setShowSoldItems: (show: boolean) => void;
  
  // Location filters
  selectedStateId: string | null;
  setSelectedStateId: (stateId: string | null) => void;
  selectedCityId: string | null; 
  setSelectedCityId: (cityId: string | null) => void;
  selectedCondominiumId: string | null;
  setSelectedCondominiumId: (condominiumId: string | null) => void;
  
  // Condominium filter
  isCondominiumFilter: boolean;
  setIsCondominiumFilter: (isCondominiumFilter: boolean) => void;
  userCondominiumId?: string;
  
  // Actions
  resetFilters: () => void;
  handleSearch: (e: React.FormEvent) => void;
  
  // UI state 
  isFilterSheetOpen: boolean;
  setIsFilterSheetOpen: (open: boolean) => void;
  
  // Price max
  maxPrice?: number;
  isMaxPriceLoading?: boolean;
}
