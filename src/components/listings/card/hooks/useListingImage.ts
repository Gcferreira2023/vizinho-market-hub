
import { useState, useEffect } from "react";

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
  const [imgSrc, setImgSrc] = useState("");
  
  // Use a known working fallback image
  const defaultPlaceholder = "/lovable-uploads/a761c01e-ede6-4e1b-b09e-cd61fdb6b0c6.png";
  
  // Determine the image URL to be used
  useEffect(() => {
    // For mock listings or empty URLs, use the placeholder
    if (isMockListing || !imageUrl || imageUrl.trim() === '' || imageUrl === '/placeholder.svg') {
      setImgSrc(defaultPlaceholder);
      return;
    }
    
    // Verify if the URL is valid (starts with http or /)
    if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) {
      setImgSrc(imageUrl);
      console.log(`Setting image src for listing ${id} to:`, imageUrl);
    } else {
      // For invalid URLs, use the placeholder
      setImgSrc(defaultPlaceholder);
      console.log(`Invalid image URL for listing ${id}, using placeholder`);
    }
  }, [id, imageUrl, isMockListing, defaultPlaceholder]);

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
      { threshold: 0.1, rootMargin: "200px" }
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
    setHasError(false);
    if (onImageLoad) onImageLoad();
  };

  const handleImageError = () => {
    console.error(`Error loading image for listing ${id}: ${imgSrc}`);
    
    // Only switch to fallback if not already using it
    if (imgSrc !== defaultPlaceholder) {
      setImgSrc(defaultPlaceholder);
    } else {
      setHasError(true);
      // Even if there's an error, we consider the image "loaded" for UI purposes
      setIsLoaded(true);
      if (onImageLoad) onImageLoad();
    }
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
