
import { ListingsFetchParams } from './types';
import { categoryMappings } from '@/constants/listings';

/**
 * Builds search parameters object for the listings API based on filter state
 */
export function buildSearchParams(params: ListingsFetchParams) {
  const searchParams: any = {};
  console.log("Starting to build search parameters with:", JSON.stringify(params, null, 2));
  
  // Search term filter
  if (params.searchTerm) {
    searchParams.search = params.searchTerm;
    console.log(`Search term: "${params.searchTerm}"`);
  }
  
  // Category filter - Garantir que estamos usando o mapeamento correto
  if (params.selectedCategory) {
    // Map UI category ID to database value before sending to API
    const dbCategory = categoryMappings.idToDb[params.selectedCategory];
    
    if (dbCategory) {
      searchParams.category = dbCategory;
      console.log(`Category filter: "${params.selectedCategory}" -> DB value: "${dbCategory}"`);
    } else {
      // Fallback: use the original ID if no mapping exists
      searchParams.category = params.selectedCategory;
      console.log(`Category filter (unmapped): "${params.selectedCategory}"`);
    }
  }
  
  // Type filter
  if (params.selectedType) {
    searchParams.type = params.selectedType;
    console.log(`Type filter: "${params.selectedType}"`);
  }
  
  // Status filter
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
  
  // Location filters
  if (params.selectedStateId) {
    searchParams.stateId = params.selectedStateId;
    console.log(`State filter: "${params.selectedStateId}"`);
  }
  
  if (params.selectedCityId) {
    searchParams.cityId = params.selectedCityId;
    console.log(`City filter: "${params.selectedCityId}"`);
  }
  
  // Condominium filter - either from location filter or user's filter
  if (params.selectedCondominiumId || (params.isCondominiumFilter && params.userCondominiumId)) {
    searchParams.condominiumId = params.selectedCondominiumId || params.userCondominiumId;
    console.log(`Condominium filter: "${searchParams.condominiumId}"`);
  }
  
  // Price range filter
  if (params.priceRange && (params.priceRange[0] !== 0 || params.priceRange[1] !== params.maxPrice)) {
    searchParams.priceRange = params.priceRange;
    console.log(`Price range filter: ${params.priceRange[0]} - ${params.priceRange[1]}`);
  }
  
  console.log("Final search parameters:", searchParams);
  return searchParams;
}
