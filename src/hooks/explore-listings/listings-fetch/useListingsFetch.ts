
import { ListingsFetchParams, ListingsFetchResult } from "./types";
import { useFetchLifecycle } from "./useFetchLifecycle";

/**
 * Main hook for fetching listings based on provided filters
 */
export function useListingsFetch(params: ListingsFetchParams): ListingsFetchResult {
  return useFetchLifecycle(params);
}
