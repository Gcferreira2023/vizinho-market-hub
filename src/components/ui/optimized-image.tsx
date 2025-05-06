
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
    if (src !== imgSrc && src) {
      setIsLoaded(false);
      setHasError(false);
      setImgSrc(src);
      console.log("OptimizedImage src set to:", src);
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
      // If even the fallback fails, mark as error but still show a visual
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

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${className}`}>
      {/* Show skeleton loader while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Skeleton className="w-full h-full absolute" />
          <ImageIcon className="w-8 h-8 text-muted-foreground opacity-50 z-10" />
        </div>
      )}

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
