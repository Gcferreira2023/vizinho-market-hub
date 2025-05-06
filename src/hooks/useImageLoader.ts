
import { useState, useEffect } from "react";

interface UseImageLoaderProps {
  src: string;
  fallbackSrc?: string;
  onLoad?: () => void;
}

export const useImageLoader = ({
  src,
  fallbackSrc = "/placeholder.svg",
  onLoad
}: UseImageLoaderProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(src);

  // Reset state when the image URL changes
  useEffect(() => {
    if (src) {
      setIsLoaded(false);
      setHasError(false);
      setImgSrc(src);
      console.log("Image src set to:", src);
      
      // Pre-load the image
      const img = new Image();
      img.src = src;
      
      img.onload = () => {
        console.log("Pre-load successful for:", src);
        setHasError(false);
      };
      
      img.onerror = () => {
        console.error("Error pre-loading image:", src);
        console.log("Switching to fallback image:", fallbackSrc);
        setImgSrc(fallbackSrc);
      };
    } else {
      // If no src is provided, use fallback immediately
      setImgSrc(fallbackSrc);
      setIsLoaded(true);
      if (onLoad) onLoad();
    }
  }, [src, fallbackSrc, onLoad]);

  const handleLoad = () => {
    console.log("Image loaded successfully:", imgSrc);
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    console.error("Image error loading:", imgSrc);
    if (imgSrc !== fallbackSrc) {
      console.log("Switching to fallback image:", fallbackSrc);
      setImgSrc(fallbackSrc);
    } else {
      // If even the fallback fails, mark as error but still show a visual
      setHasError(true);
      setIsLoaded(true);
    }
  };

  return {
    isLoaded,
    hasError,
    imgSrc,
    handleLoad,
    handleError
  };
};

export default useImageLoader;
