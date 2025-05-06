
import { useState, useEffect } from "react";
import { Image as ImageIcon, ImageOff, AlertTriangle } from "lucide-react";

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

  // For mock listings, always use a placeholder
  const actualImageUrl = isMockListing || !imageUrl || imageUrl.trim() === '' 
    ? "/placeholder.svg" 
    : imageUrl;
  
  // Debug the image URL
  useEffect(() => {
    console.log(`Image loader for ${id}: Using URL ${actualImageUrl}`);
    console.log(`Original URL: ${imageUrl}, is mock: ${isMockListing}`);
  }, [id, actualImageUrl, imageUrl, isMockListing]);
  
  // Pre-load image to check for errors
  useEffect(() => {
    if (actualImageUrl && actualImageUrl !== "/placeholder.svg") {
      console.log(`Pre-loading image for ${id}: ${actualImageUrl}`);
      const img = new Image();
      img.src = actualImageUrl;
      img.onload = () => {
        console.log(`Pre-load successful for ${id}: ${actualImageUrl}`);
        setImgError(false);
      };
      img.onerror = () => {
        console.error(`Error pre-loading image for ${id}: ${actualImageUrl}`);
        setImgError(true);
      };
    }
  }, [actualImageUrl, id]);

  // Lazy loading observer
  useEffect(() => {
    if (!lazyLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log(`Card ${id} is now visible, loading image`);
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const currentCard = document.getElementById(`listing-card-${id}`);
    if (currentCard) {
      observer.observe(currentCard);
    } else {
      console.warn(`Card element with ID listing-card-${id} not found`);
    }

    return () => {
      observer.disconnect();
    };
  }, [id, lazyLoad]);
  
  const handleImageLoad = () => {
    console.log(`Image loaded successfully: ${actualImageUrl}`);
    setImgLoaded(true);
    if (onImageLoad) onImageLoad();
  };
  
  const handleImageError = () => {
    console.error(`Error loading image ${actualImageUrl}, using placeholder`);
    setImgError(true);
    setImgLoaded(true);
    if (onImageLoad) onImageLoad();
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
