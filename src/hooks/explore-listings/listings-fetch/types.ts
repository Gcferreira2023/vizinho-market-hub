
import { ListingStatus } from "@/components/listings/StatusBadge";

export interface ListingsFetchParams {
  searchTerm: string;
  selectedCategory: string | null;
  selectedType: string | null;
  selectedStatus: string | null;
  showSoldItems: boolean;
  priceRange: [number, number];
  isCondominiumFilter: boolean;
  userCondominiumId: string | undefined;
  selectedStateId: string | null;
  selectedCityId: string | null;
  selectedCondominiumId: string | null;
  maxPrice: number | undefined;
}

export interface ListingsFetchResult {
  listings: any[];
  isLoading: boolean;
  hasError: boolean;
  retryLoadListings: () => void;
}
