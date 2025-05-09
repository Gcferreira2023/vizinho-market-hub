
import { useState, useEffect, useRef } from "react";

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
  const imgSrcRef = useRef("");
  
  // Use a known working fallback image
  const defaultPlaceholder = "/lovable-uploads/a761c01e-ede6-4e1b-b09e-cd61fdb6b0c6.png";
  
  // Determine the image URL to be used
  useEffect(() => {
    // For mock listings or empty URLs, use the placeholder
    if (isMockListing || !imageUrl || imageUrl.trim() === '' || imageUrl === '/placeholder.svg') {
      setImgSrc(defaultPlaceholder);
      imgSrcRef.current = defaultPlaceholder;
      return;
    }
    
    // Verify if the URL is valid (starts with http or /)
    if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) {
      setImgSrc(imageUrl);
      imgSrcRef.current = imageUrl;
    } else {
      // For invalid URLs, use the placeholder
      setImgSrc(defaultPlaceholder);
      imgSrcRef.current = defaultPlaceholder;
    }
  }, [id, imageUrl, isMockListing, defaultPlaceholder]);

  // Lazy loading with Intersection Observer
  useEffect(() => {
    if (!lazyLoad) {
      setIsVisible(true);
      return;
    }

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
    setIsLoaded(true);
    setHasError(false);
    if (onImageLoad) onImageLoad();
  };

  const handleImageError = () => {
    console.error(`Image error for listing ${id}: ${imgSrcRef.current}`);
    
    // Only switch to fallback if not already using it
    if (imgSrcRef.current !== defaultPlaceholder) {
      console.log(`Switching to fallback image for listing ${id}`);
      setImgSrc(defaultPlaceholder);
      imgSrcRef.current = defaultPlaceholder;
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
