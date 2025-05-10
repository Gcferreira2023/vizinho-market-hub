
// Main listing service file that re-exports from modules
import { checkStorageBucket } from "../storage/storageService";
import { uploadListingImages, fetchListingImages, deleteRemovedImages } from "../images/imageService";
import { ensureUserExists, checkListingOwnership } from "../users/userService";

// Re-export from fetchers
export { 
  fetchListing,
  fetchListings, 
  fetchListingCondominium 
} from './fetchers';

// Re-export from creators
export { 
  createListing 
} from './creators';

// Re-export from updaters
export { 
  updateListing,
  deleteListing 
} from './updaters';

// Re-exporting for backwards compatibility
export {
  checkStorageBucket,
  uploadListingImages,
  fetchListingImages,
  deleteRemovedImages,
  ensureUserExists,
  checkListingOwnership,
};
