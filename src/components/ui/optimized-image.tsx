
import { useState, useEffect } from "react";
import { useMobile } from "@/hooks/useMobile";
import { ImageIcon, ImageOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
  fallbackSrc = "/lovable-uploads/a761c01e-ede6-4e1b-b09e-cd61fdb6b0c6.png",
  aspectRatio = "aspect-[4/3]",
  touchable = false
}: OptimizedImageProps) => {
  const isMobile = useMobile();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  // Update image source if src prop changes
  useEffect(() => {
    if (src && src !== imgSrc && !hasError) {
      setImgSrc(src);
      setIsLoaded(false);
    }
  }, [src]);

  const objectFitClass = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill"
  }[objectFit];

  // Classes for touchable images on mobile devices
  const touchableClass = touchable && isMobile 
    ? "active:scale-[0.98] transition-transform" 
    : "";

  const handleLoad = () => {
    console.log(`Image loaded successfully: ${imgSrc}`);
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    console.error(`Error loading image: ${imgSrc}`);
    
    if (imgSrc !== fallbackSrc) {
      console.log(`Switching to fallback: ${fallbackSrc}`);
      setImgSrc(fallbackSrc);
    } else {
      setHasError(true);
      setIsLoaded(true); // Mark as loaded even if it's an error
    }
  };

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${className}`}>
      {/* Show skeleton loader while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
          <Skeleton className="w-full h-full absolute" />
          <ImageIcon className="h-8 w-8 text-muted-foreground opacity-50" />
        </div>
      )}

      {/* Always render the img tag, but set opacity based on loaded state */}
      <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={`w-full h-full transition-opacity duration-300 ${objectFitClass} ${isLoaded && !hasError ? "opacity-100" : "opacity-0"} ${touchableClass}`}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={handleLoad}
        onError={handleError}
      />

      {/* Show error state if both original and fallback images failed */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-20">
          <div className="bg-background/80 p-3 rounded-full">
            <ImageOff className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
