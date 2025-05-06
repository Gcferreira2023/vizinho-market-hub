
import { ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMobile } from "@/hooks/useMobile";
import { useState, useEffect } from "react";

const HeroImage = () => {
  const isMobile = useMobile();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Use a local image that we know exists
  const initialImage = "/placeholder-furniture.jpg";
  const [imgSrc, setImgSrc] = useState(initialImage);
  
  const handleLoad = () => {
    setIsLoaded(true);
    console.log("Hero image loaded successfully");
  };
  
  const handleError = () => {
    console.error("Failed to load hero image:", imgSrc);
    if (imgSrc !== "/placeholder.svg") {
      setImgSrc("/placeholder.svg");
    }
    setHasError(true);
  };
  
  return (
    <div className="md:w-1/2 flex justify-center px-4 md:px-0">
      <div className="w-full max-w-lg relative rounded-lg shadow-xl overflow-hidden">
        {/* Loading state */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
            <Skeleton className="w-full h-full absolute" />
            <ImageIcon className="h-10 w-10 text-gray-400" />
          </div>
        )}
        
        <img
          src={imgSrc}
          alt="VizinhoMarket"
          className={`w-full aspect-[4/3] object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          width={isMobile ? 640 : 1200}
          height={isMobile ? 480 : 900}
        />
      </div>
    </div>
  );
};

export default HeroImage;
