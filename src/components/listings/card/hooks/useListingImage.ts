
import { useState, useEffect } from "react";
import { ListingStatus } from "@/components/listings/StatusBadge";

interface UseListingImageProps {
  id: string;
  imageUrl: string;
  category: string;
  type: "produto" | "serviço";
  isMockListing: boolean;
  lazyLoad: boolean;
  onImageLoad?: () => void;
}

export const useListingImage = ({
  id,
  imageUrl,
  category,
  type,
  isMockListing,
  lazyLoad,
  onImageLoad
}: UseListingImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazyLoad);
  
  // For mock listings or empty URLs, use category-specific placeholder images
  const getCategoryImage = () => {
    if (isMockListing) {
      // Select an image based on category
      const categoryLower = category.toLowerCase();
      if (categoryLower.includes("eletrônico") || categoryLower.includes("tecnologia")) {
        return "/placeholder-electronics.jpg";
      } else if (categoryLower.includes("móveis") || categoryLower.includes("decoração")) {
        return "/placeholder-furniture.jpg";
      } else if (categoryLower.includes("roupa") || categoryLower.includes("vestuário") || categoryLower.includes("moda")) {
        return "/placeholder-clothing.jpg";
      } else if (categoryLower.includes("serviço") || type === "serviço") {
        return "/placeholder-services.jpg";
      } else if (categoryLower.includes("alimento")) {
        return "/placeholder-clothing.jpg"; // Using clothing as a fallback for food
      } else {
        // If no specific category match, use generic placeholder
        return "/placeholder.svg";
      }
    }
    
    // For real listings, use the provided image or default placeholder
    return (imageUrl && imageUrl !== "") ? imageUrl : "/placeholder.svg";
  };
  
  const imgSrc = getCategoryImage();
  
  // Debug logging
  useEffect(() => {
    console.log(`Rendering listing ${id} image: category=${category}, type=${type}, isMock=${isMockListing}, src=${imgSrc}`);
  }, [id, category, type, isMockListing, imgSrc]);

  // Lazy loading with Intersection Observer
  useEffect(() => {
    if (!lazyLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const currentCard = document.getElementById(`listing-card-${id}`);
    if (currentCard) {
      observer.observe(currentCard);
    }

    return () => observer.disconnect();
  }, [id, lazyLoad]);

  const handleImageLoad = () => {
    console.log(`Image loaded successfully for listing ${id}: ${imgSrc}`);
    setIsLoaded(true);
    if (onImageLoad) onImageLoad();
  };

  const handleImageError = () => {
    console.error(`Error loading image for listing ${id}: ${imgSrc}`);
    setHasError(true);
    // Even if there's an error, we consider the image "loaded" for UI purposes
    setIsLoaded(true);
    if (onImageLoad) onImageLoad();
  };

  return {
    isLoaded,
    hasError,
    isVisible,
    imgSrc,
    handleImageLoad,
    handleImageError
  };
};

export default useListingImage;
