
import React, { useState } from "react";
import OptimizedImage from "@/components/ui/optimized-image";
import { ImageOff } from "lucide-react";

const HeroImage = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const heroImageUrl = "/lovable-uploads/e2f53080-25f1-41fe-9777-edff03f14f94.png";
  const fallbackImageUrl = "/lovable-uploads/a761c01e-ede6-4e1b-b09e-cd61fdb6b0c6.png";
  
  const handleImageLoad = () => {
    console.log("Hero image loaded successfully");
    setImageLoaded(true);
  };
  
  return (
    <div className="md:w-1/2 flex justify-center px-4 md:px-0">
      <div className="w-full max-w-lg relative rounded-lg shadow-xl overflow-hidden bg-gray-100">
        {/* Loading state - shown while the image is loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
        
        {/* Main image */}
        <OptimizedImage 
          src={heroImageUrl}
          alt="VizinhoMarket - Comércio entre vizinhos no condomínio"
          className={`w-full aspect-[4/3] transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          priority={true}
          objectFit="cover"
          onLoad={handleImageLoad}
          fallbackSrc={fallbackImageUrl}
        />
        
        {/* Error fallback for extreme cases */}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/80">
            <ImageOff className="w-10 h-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Não foi possível carregar a imagem</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroImage;
