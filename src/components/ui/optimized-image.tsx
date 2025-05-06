
import { useState, useEffect } from "react";
import { Image as ImageIcon, ImageOff } from "lucide-react";
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
  fallbackSrc = "/placeholder.svg"
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false);
    setHasError(false);
    setImgSrc(src);
  }, [src]);

  // Optimize image URL if it's from Unsplash
  useEffect(() => {
    if (src && src.includes("unsplash.com") && !src.includes("&w=")) {
      const optimizedWidth = width || 800;
      const optimizedUrl = `${src}${src.includes("?") ? "&" : "?"}auto=format&q=80&w=${optimizedWidth}`;
      setImgSrc(optimizedUrl);
    }
  }, [src, width]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
    setImgSrc(fallbackSrc);
  };

  const objectFitClass = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill"
  }[objectFit];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Skeleton className="w-full h-full absolute" />
          <ImageIcon className="w-8 h-8 text-muted-foreground opacity-50" />
        </div>
      )}

      <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={`w-full h-full transition-opacity duration-300 ${objectFitClass} ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={handleLoad}
        onError={handleError}
      />

      {hasError && imgSrc === fallbackSrc && (
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
