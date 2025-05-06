
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
  const [imgSrc, setImgSrc] = useState<string>(fallbackSrc); // Start with fallback

  // Reset state when the image URL changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    
    if (!src || src === "") {
      console.log("No source provided, using fallback immediately:", fallbackSrc);
      setImgSrc(fallbackSrc);
      setIsLoaded(true);
      if (onLoad) onLoad();
      return;
    }
    
    console.log("Image src set to:", src);
    setImgSrc(src);
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
