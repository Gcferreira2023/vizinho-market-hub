import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export interface ExistingImage {
  id: string;
  image_url: string;
  position?: number;
  ad_id?: string;
}

export const useListingImages = () => {
  const { toast } = useToast();
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleImagesChange = (newImages: File[], newUrls: string[]) => {
    // Track which existing images were kept and which were removed
    const keptExistingUrls = newUrls.filter(url => 
      existingImages.some(img => img.image_url === url)
    );
    
    // Update the list of existing images to keep
    const updatedExistingImages = existingImages.filter(img => 
      keptExistingUrls.includes(img.image_url)
    );
    
    setExistingImages(updatedExistingImages);
    
    // New images are the files that were added
    const actualNewImages = newImages.filter(file => 
      !existingImages.some(img => URL.createObjectURL(file) === img.image_url)
    );
    
    setImages(actualNewImages);
    setImageUrls(newUrls);
  };

  const validateImages = () => {
    if (imageUrls.length === 0) {
      toast({
        title: "Imagens obrigatórias",
        description: "Adicione pelo menos uma imagem ao seu anúncio",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  return {
    existingImages,
    setExistingImages,
    images,
    setImages,
    imageUrls,
    setImageUrls,
    handleImagesChange,
    validateImages
  };
};
