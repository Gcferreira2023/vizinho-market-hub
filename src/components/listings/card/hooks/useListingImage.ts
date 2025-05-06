
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
  
  // Use a imagem placeholder local que sabemos que existe
  const defaultPlaceholder = "/placeholder.svg";
  
  // Determinar a URL da imagem a ser usada
  const determineImageUrl = () => {
    // Para anúncios mock ou URLs vazias, usar o placeholder
    if (isMockListing || !imageUrl || imageUrl.trim() === '') {
      return defaultPlaceholder;
    }
    
    // Para anúncios reais, usar a URL fornecida
    return imageUrl;
  };
  
  const imgSrc = determineImageUrl();
  
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

  // Preload the image
  useEffect(() => {
    if (!isVisible) return;
    
    const preloadImage = new Image();
    preloadImage.src = imgSrc;
    
    preloadImage.onload = () => {
      console.log(`Preloaded image for listing ${id}: ${imgSrc}`);
    };
    
    preloadImage.onerror = () => {
      console.error(`Error preloading image for listing ${id}: ${imgSrc}`);
      setHasError(true);
    };
    
    return () => {
      preloadImage.onload = null;
      preloadImage.onerror = null;
    };
  }, [imgSrc, isVisible, id]);

  const handleImageLoad = () => {
    console.log(`Image loaded successfully for listing ${id}: ${imgSrc}`);
    setIsLoaded(true);
    setHasError(false);
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
