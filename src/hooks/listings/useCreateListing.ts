
import { useListingForm } from "./useListingForm";
import { useListingImages } from "./useListingImages";
import { useListingCreator } from "./useListingCreator";
import { initialListingFormData } from "@/types/listing";

export const useCreateListing = () => {
  // Use the form hook with initial data
  const formHook = useListingForm(initialListingFormData);
  
  // Use the images hook
  const imagesHook = useListingImages();
  
  // Use the creator hook
  const { createListing: createListingAction, isLoading } = useListingCreator();
  
  // Define a function to handle the listing creation
  const handleCreateListing = async () => {
    // Validate images
    if (!imagesHook.validateImages()) return false;
    
    return await createListingAction(formHook.formData, imagesHook.images);
  };

  return {
    formData: formHook.formData,
    handleChange: formHook.handleChange,
    handleSelectChange: formHook.handleSelectChange,
    handleCheckboxChange: formHook.handleCheckboxChange,
    imageUrls: imagesHook.imageUrls,
    images: imagesHook.images,
    handleImagesChange: imagesHook.handleImagesChange,
    validateImages: imagesHook.validateImages,
    createListing: handleCreateListing,
    isLoading
  };
};
