
import { useEffect } from "react";
import { EditListingFormData } from "@/types/listing";
import { useListingForm } from "./useListingForm";
import { useListingImages } from "./useListingImages";
import { useListingOperations } from "./useListingOperations";
import { useListingFetcher } from "./useListingFetcher";
import { useListingSaver } from "./useListingSaver";
import { useListingDeleter } from "./useListingDeleter";

// Initial form data
const initialFormData: EditListingFormData = {
  title: "",
  description: "",
  price: "",
  category: "",
  type: "produto",
  availability: "",
  delivery: false,
  deliveryFee: "0",
  paymentMethods: "Dinheiro, Pix",
  priceUponRequest: false,
};

export const useEditListing = (listingId: string) => {
  // Use the form hook
  const formHook = useListingForm(initialFormData);
  
  // Use the images hook
  const imagesHook = useListingImages();
  
  // Use the operations hook
  const { isLoading, isSaving, isDeleting, setIsLoading, setIsSaving, setIsDeleting } = useListingOperations();

  // Use the fetcher hook
  const { fetchListingData: fetchData } = useListingFetcher(listingId, setIsLoading);
  
  // Use the saver hook
  const { saveListing: save } = useListingSaver(listingId, setIsSaving);
  
  // Use the deleter hook
  const { deleteListing: deleteAd } = useListingDeleter(listingId, setIsDeleting);
  
  // Wrapper functions to connect hooks
  const fetchListingData = async () => {
    await fetchData(
      formHook.setFormData,
      imagesHook.setExistingImages,
      imagesHook.setImageUrls
    );
  };
  
  const saveListing = async () => {
    // Validate images
    if (!imagesHook.validateImages()) return;
    
    await save(
      formHook.formData,
      imagesHook.existingImages,
      imagesHook.images
    );
  };
  
  const deleteListing = async () => {
    await deleteAd();
  };

  // Load listing data when component mounts
  useEffect(() => {
    fetchListingData();
  }, [listingId]);

  return {
    formData: formHook.formData,
    imageUrls: imagesHook.imageUrls,
    images: imagesHook.images,
    isLoading,
    isSaving,
    isDeleting,
    handleChange: formHook.handleChange,
    handleSelectChange: formHook.handleSelectChange,
    handleCheckboxChange: formHook.handleCheckboxChange,
    handleImagesChange: imagesHook.handleImagesChange,
    fetchListingData,
    saveListing,
    deleteListing
  };
};
