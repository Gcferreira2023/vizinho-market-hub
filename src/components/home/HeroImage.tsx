
import React, { useState } from "react";
import OptimizedImage from "@/components/ui/optimized-image";
import { ImageOff } from "lucide-react";

const HeroImage = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Use both images as they are already uploaded
  const heroImageUrl = "/lovable-uploads/e2f53080-25f1-41fe-9777-edff03f14f94.png";
  const fallbackImageUrl = "/lovable-uploads/a761c01e-ede6-4e1b-b09e-cd61fdb6b0c6.png";
  
  const handleImageLoad = () => {
    console.log("Hero image loaded successfully");
    setImageLoaded(true);
    setHasError(false);
  };
  
  const handleImageError = () => {
    console.error("Failed to load hero image, using fallback");
    setHasError(true);
  };
  
  return (
    <div className="md:w-1/2 flex justify-center px-4 md:px-0">
      <div className="w-full max-w-lg relative rounded-lg shadow-xl overflow-hidden bg-gray-100">
        {/* Loading state - shown while the image is loading */}
        {!imageLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
        
        {/* Main image */}
        <OptimizedImage 
          src={heroImageUrl}
          alt="VizinhoMarket - Comércio entre vizinhos no condomínio"
          className={`w-full aspect-[4/3] transition-opacity duration-500 ${imageLoaded && !hasError ? 'opacity-100' : 'opacity-0'}`}
          priority={true}
          objectFit="cover"
          onLoad={handleImageLoad}
          onError={handleImageError}
          fallbackSrc={fallbackImageUrl}
        />
        
        {/* Error fallback for extreme cases */}
        {hasError && (
          <>
            <OptimizedImage
              src={fallbackImageUrl}
              alt="VizinhoMarket - Fallback Image"
              className="w-full aspect-[4/3]"
              priority={true}
              objectFit="cover"
            />
            <div className="absolute bottom-2 right-2 bg-red-100 rounded-md px-2 py-1 text-xs text-red-600 flex items-center gap-1">
              <ImageOff className="w-3 h-3" />
              Imagem alternativa
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HeroImage;
