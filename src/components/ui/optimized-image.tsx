
import { useState, useEffect } from "react";
import { Image as ImageIcon, ImageOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMobile } from "@/hooks/useMobile";

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const isMobile = useMobile();

  // Reset state when the image URL changes
  useEffect(() => {
    if (src !== imgSrc) {
      setIsLoaded(false);
      setHasError(false);
      setImgSrc(src || fallbackSrc);
      console.log("OptimizedImage src set to:", src || fallbackSrc);
    }
  }, [src, fallbackSrc, imgSrc]);

  const handleLoad = () => {
    console.log("OptimizedImage loaded successfully:", imgSrc);
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    console.error("OptimizedImage error loading:", imgSrc);
    if (imgSrc !== fallbackSrc) {
      console.log("Switching to fallback image:", fallbackSrc);
      setImgSrc(fallbackSrc);
    } else {
      setHasError(true);
      setIsLoaded(true);
    }
  };

  const objectFitClass = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill"
  }[objectFit];

  // Classes for touchable images on mobile devices
  const touchableClass = touchable && isMobile 
    ? "active:scale-[0.98] transition-transform" 
    : "";

  // If we're showing a placeholder or SVG, don't use fading effects
  const isPlaceholder = imgSrc === "/placeholder.svg" || imgSrc.endsWith(".svg");
  const fadeClasses = isPlaceholder ? "opacity-100" : (isLoaded ? "opacity-100" : "opacity-0");

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${className}`}>
      {/* Show skeleton loader only while loading actual images (not placeholders) */}
      {!isLoaded && !isPlaceholder && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Skeleton className="w-full h-full absolute" />
          <ImageIcon className="w-8 h-8 text-muted-foreground opacity-50" />
        </div>
      )}

      {/* For placeholder SVGs, we don't need loading animation */}
      {isPlaceholder && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
      )}

      <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={`w-full h-full transition-opacity duration-300 ${objectFitClass} ${fadeClasses} ${touchableClass}`}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={handleLoad}
        onError={handleError}
      />

      {/* Show error state if both original and fallback images failed */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <div className="bg-background/80 p-2 rounded-full">
            <ImageOff className="w-6 h-6 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
