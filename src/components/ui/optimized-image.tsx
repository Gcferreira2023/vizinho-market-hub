
import { useState } from "react";
import { useMobile } from "@/hooks/useMobile";
import useImageLoader from "@/hooks/useImageLoader";
import ImageLoadingState from "./image/ImageLoadingState";
import ImageErrorState from "./image/ImageErrorState";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  objectFit?: "cover" | "contain" | "fill";
  width?: number;
  height?: number;
  priority?: boolean;
  onLoad?: () => void;
  blurDataUrl?: string;
  fallbackSrc?: string;
  aspectRatio?: string;
  touchable?: boolean;
}

export const OptimizedImage = ({
  src,
  alt,
  className = "",
  objectFit = "cover",
  width,
  height,
  priority = false,
  onLoad,
  blurDataUrl,
  fallbackSrc = "/placeholder.svg",
  aspectRatio = "aspect-[4/3]",
  touchable = false
}: OptimizedImageProps) => {
  const isMobile = useMobile();
  const {
    isLoaded,
    hasError,
    imgSrc,
    handleLoad,
    handleError
  } = useImageLoader({
    src,
    fallbackSrc,
    onLoad
  });

  const objectFitClass = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill"
  }[objectFit];

  // Classes for touchable images on mobile devices
  const touchableClass = touchable && isMobile 
    ? "active:scale-[0.98] transition-transform" 
    : "";

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${className}`}>
      {/* Show skeleton loader while loading */}
      <ImageLoadingState isVisible={!isLoaded} />

      {/* Always render the img tag, but set opacity based on loaded state */}
      <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={`w-full h-full transition-opacity duration-300 ${objectFitClass} ${isLoaded ? "opacity-100" : "opacity-0"} ${touchableClass}`}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={handleLoad}
        onError={handleError}
      />

      {/* Show error state if both original and fallback images failed */}
      <ImageErrorState isVisible={hasError} />
    </div>
  );
};

export default OptimizedImage;
