
import { useState, useEffect } from "react";

interface UseImageLoaderProps {
  imageUrl: string;
  isMockListing: boolean;
  lazyLoad: boolean;
  id: string;
  onImageLoad?: () => void;
}

export const useImageLoader = ({
  imageUrl,
  isMockListing,
  lazyLoad,
  id,
  onImageLoad
}: UseImageLoaderProps) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazyLoad);

  // Always use a placeholder for mock listings
  const actualImageUrl = isMockListing 
    ? "/placeholder.svg" 
    : (imageUrl || "/placeholder.svg");
  
  // Lazy loading observer
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

    return () => {
      observer.disconnect();
    };
  }, [id, lazyLoad]);
  
  // Debug for image loading
  useEffect(() => {
    if (isVisible) {
      console.log(`Card ${id} loading image:`, actualImageUrl);
    }
  }, [isVisible, actualImageUrl, id]);
  
  const handleImageLoad = () => {
    setImgLoaded(true);
    if (onImageLoad) onImageLoad();
  };
  
  const handleImageError = () => {
    console.error(`Image error loading ${actualImageUrl}, using placeholder`);
    setImgError(true);
    handleImageLoad();
  };

  return {
    imgError,
    imgLoaded,
    isVisible,
    actualImageUrl,
    handleImageLoad,
    handleImageError
  };
};
