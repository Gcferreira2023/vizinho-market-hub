
import React, { useState } from "react";
import OptimizedImage from "@/components/ui/optimized-image";
import { ImageOff } from "lucide-react";

const HeroImage = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const heroImageUrl = "/lovable-uploads/e2f53080-25f1-41fe-9777-edff03f14f94.png";
  
  const handleImageLoad = () => {
    console.log("Hero image loaded successfully");
    setImageLoaded(true);
  };
  
  return (
    <div className="md:w-1/2 flex justify-center px-4 md:px-0">
      <div className="w-full max-w-lg relative rounded-lg shadow-xl overflow-hidden bg-gray-100">
        <OptimizedImage 
          src={heroImageUrl}
          alt="VizinhoMarket - Comércio entre vizinhos no condomínio"
          className={`w-full aspect-[4/3] transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          priority={true}
          objectFit="cover"
          onLoad={handleImageLoad}
          fallbackSrc="/lovable-uploads/a761c01e-ede6-4e1b-b09e-cd61fdb6b0c6.png"
        />
        
        {/* Fallback for extreme cases where even fallback image fails */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <div className="bg-background/80 p-3 rounded-full">
              <ImageOff className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroImage;
