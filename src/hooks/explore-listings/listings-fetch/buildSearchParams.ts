
import { ListingsFetchParams } from "./types";
import { categoryMappings } from "@/constants/listings";

/**
 * Helper function to build search parameters for fetching listings
 */
export function buildSearchParams(params: ListingsFetchParams): Record<string, any> {
  console.log("Starting to build search parameters with:", JSON.stringify(params, null, 2));
  
  const searchParams: Record<string, any> = {};
  
  // Add search term filter
  if (params.searchTerm) {
    searchParams.search = params.searchTerm;
    console.log(`Search term: "${params.searchTerm}"`);
  }
  
  // Add category filter
  if (params.selectedCategory) {
    // Pass the category ID directly, the mapping will be done in the fetcher
    searchParams.category = params.selectedCategory;
    console.log(`Category filter: "${params.selectedCategory}"`);
    
    // Log mapping for debugging
    if (categoryMappings.idToDb[params.selectedCategory]) {
      console.log(`Will map to DB value: "${categoryMappings.idToDb[params.selectedCategory]}"`);
    }
  }
  
  // Add type filter
  if (params.selectedType) {
    searchParams.type = params.selectedType;
    console.log(`Type filter: "${params.selectedType}"`);
  }
  
  // Add status filter
  if (params.selectedStatus) {
    // Convert from UI status to DB status
    if (params.selectedStatus === "disponível") searchParams.status = "active";
    else if (params.selectedStatus === "reservado") searchParams.status = "reserved";
    else if (params.selectedStatus === "vendido") searchParams.status = "sold";
    console.log(`Status filter: "${params.selectedStatus}" -> "${searchParams.status}"`);
  } else if (!params.showSoldItems) {
    searchParams.status = "active";
    console.log("Status filter: only active items (excluding sold)");
  }
  
  // Add location filters
  if (params.selectedStateId) {
    searchParams.stateId = params.selectedStateId;
    console.log(`State filter: "${params.selectedStateId}"`);
  }
  
  if (params.selectedCityId) {
    searchParams.cityId = params.selectedCityId;
    console.log(`City filter: "${params.selectedCityId}"`);
  }
  
  // Add condominium filter
  if (params.selectedCondominiumId || (params.isCondominiumFilter && params.userCondominiumId)) {
    searchParams.condominiumId = params.selectedCondominiumId || params.userCondominiumId;
    console.log(`Condominium filter: "${searchParams.condominiumId}"`);
  }
  
  // Add price range filter
  if (params.priceRange && (params.priceRange[0] !== 0 || params.priceRange[1] !== params.maxPrice)) {
    searchParams.priceRange = params.priceRange;
    console.log(`Price range filter: ${params.priceRange[0]} - ${params.priceRange[1]}`);
  }
  
  console.log("Final search parameters:", searchParams);
  return searchParams;
}
