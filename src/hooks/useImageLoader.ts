
import { useState, useEffect } from "react";

interface UseImageLoaderProps {
  src: string;
  fallbackSrc?: string;
  onLoad?: () => void;
}

export const useImageLoader = ({
  src,
  fallbackSrc = "/lovable-uploads/a761c01e-ede6-4e1b-b09e-cd61fdb6b0c6.png",
  onLoad
}: UseImageLoaderProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc); // Start with actual source

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
    
    // Check if the URL starts with "http" before trying to load
    if (src.startsWith('http')) {
      console.log("Image src set to:", src);
      setImgSrc(src);
    } else {
      console.log("Invalid image URL format, using fallback:", fallbackSrc);
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
