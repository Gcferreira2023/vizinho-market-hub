
import { useState, useEffect } from "react";
import { ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMobile } from "@/hooks/useMobile";
import useImageLoader from "@/hooks/useImageLoader";

const HeroImage = () => {
  const isMobile = useMobile();
  
  // Use a local image instead of an external URL that might not load
  const imageUrl = "/hero-image.jpg";
  const fallbackUrl = "/placeholder-furniture.jpg"; // Use furniture placeholder as fallback
  
  const {
    isLoaded,
    hasError,
    imgSrc,
    handleLoad,
    handleError
  } = useImageLoader({
    src: imageUrl,
    fallbackSrc: fallbackUrl,
    onLoad: () => console.log("Hero image loaded successfully")
  });
  
  return (
    <div className="md:w-1/2 flex justify-center px-4 md:px-0">
      <div className="w-full max-w-lg relative rounded-lg shadow-xl overflow-hidden">
        {/* Loading state */}
        {!isLoaded && (
          <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center">
            <Skeleton className="w-full h-full absolute" />
            <ImageIcon className="h-10 w-10 text-gray-400" />
          </div>
        )}
        
        {/* Main image */}
        <img
          src={imgSrc}
          alt="VizinhoMarket"
          className={`w-full object-cover transition-opacity duration-300 aspect-[4/3] ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading="eager" // Load with priority as it's above the fold
          fetchPriority="high"
          width={isMobile ? 640 : 1200}
          height={isMobile ? 480 : 900}
        />
      </div>
    </div>
  );
};

export default HeroImage;
