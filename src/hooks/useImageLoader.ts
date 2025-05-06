
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
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);

  // Reset state when the image URL changes
  useEffect(() => {
    if (src !== imgSrc && src) {
      setIsLoaded(false);
      setHasError(false);
      setImgSrc(src);
      console.log("Image src set to:", src);
    }
  }, [src, imgSrc]);

  // If src is empty or undefined, use fallback immediately
  useEffect(() => {
    if (!src || src === "") {
      setImgSrc(fallbackSrc);
      console.log("Using fallback image immediately:", fallbackSrc);
      // Consider this pre-loaded if we're using fallback
      setIsLoaded(true);
      if (onLoad) onLoad();
    }
  }, [src, fallbackSrc, onLoad]);

  // Pre-load the image to check if it works
  useEffect(() => {
    if (imgSrc && imgSrc !== fallbackSrc && !isLoaded) {
      console.log(`Pre-loading image: ${imgSrc}`);
      
      try {
        const preloadImage = new Image();
        preloadImage.src = imgSrc;
        preloadImage.onload = () => {
          console.log(`Pre-load successful: ${imgSrc}`);
          setHasError(false);
        };
        preloadImage.onerror = () => {
          console.error(`Error pre-loading image: ${imgSrc}`);
          setImgSrc(fallbackSrc);
          setIsLoaded(true);
          if (onLoad) onLoad();
        };
      } catch (error) {
        console.error(`Error during pre-load setup: ${error}`);
        setImgSrc(fallbackSrc);
        setIsLoaded(true);
        if (onLoad) onLoad();
      }
    }
  }, [imgSrc, fallbackSrc, isLoaded, onLoad]);

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
