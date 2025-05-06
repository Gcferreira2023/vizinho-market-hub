
import { useState, useEffect } from "react";
import { Image as ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMobile } from "@/hooks/useMobile";

const HeroImage = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isMobile = useMobile();
  
  // Use a local image instead of an external URL that might not load
  const imageUrl = "/hero-image.jpg";
  const fallbackUrl = "/placeholder.svg";
  
  // Pre-load the image to check if it works
  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      console.log("Hero image loaded successfully:", imageUrl);
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.error("Error loading hero image:", imageUrl);
      setImageError(true);
      setImageLoaded(true); // Set loaded to true so we show the fallback
    };
  }, [imageUrl]);
  
  return (
    <div className="md:w-1/2 flex justify-center px-4 md:px-0">
      <div className="w-full max-w-lg relative rounded-lg shadow-xl overflow-hidden">
        {!imageLoaded && (
          <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center">
            <Skeleton className="w-full h-full absolute" />
            <ImageIcon className="h-10 w-10 text-gray-400" />
          </div>
        )}
        <img
          src={imageError ? fallbackUrl : imageUrl}
          alt="VizinhoMarket"
          className={`w-full object-cover transition-opacity duration-300 aspect-[4/3] ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageLoaded(true);
            setImageError(true);
          }}
          loading="eager" // Carrega com prioridade por ser above the fold
          fetchPriority="high"
          width={isMobile ? 640 : 1200}
          height={isMobile ? 480 : 900}
        />
      </div>
    </div>
  );
};

export default HeroImage;
