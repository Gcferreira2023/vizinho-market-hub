
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ListingStatus } from "@/components/listings/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook for initializing filter state values
 */
export function useFiltersState(maxPrice: number = 2000) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlSearchTerm = queryParams.get("search");
  const urlCondominiumId = queryParams.get("condominiumId");
  const urlCategory = queryParams.get("category");
  const { user } = useAuth();
  
  // User condominium from metadata
  const userCondominiumId = user?.user_metadata?.condominiumId;
  
  // Search filters
  const [searchTerm, setSearchTerm] = useState(urlSearchTerm || "");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  
  // Category and type filters
  const [selectedCategory, setSelectedCategory] = useState<string | null>(urlCategory || null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  // Status filters
  const [selectedStatus, setSelectedStatus] = useState<ListingStatus | null>(null);
  const [showSoldItems, setShowSoldItems] = useState(true);
  
  // UI state
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  
  // Condominium filter
  const [isCondominiumFilter, setIsCondominiumFilter] = useState(urlCondominiumId ? true : false);
  
  // Location filters
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [selectedCondominiumId, setSelectedCondominiumId] = useState<string | null>(urlCondominiumId);

  return {
    // User data
    userCondominiumId,
    
    // URL params
    urlSearchTerm,
    urlCondominiumId,
    urlCategory,
    
    // Filter states
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
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    isCondominiumFilter,
    setIsCondominiumFilter,
    selectedStateId,
    setSelectedStateId,
    selectedCityId,
    setSelectedCityId,
    selectedCondominiumId,
    setSelectedCondominiumId
  };
}
