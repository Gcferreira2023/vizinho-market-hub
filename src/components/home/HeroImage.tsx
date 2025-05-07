
import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const HeroImage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Usamos uma imagem de condomínio
  const imagePath = "/lovable-uploads/1eb7a9ee-15c6-4be9-bc68-ecfc1c5640be.png";
  
  const handleLoad = () => {
    setIsLoaded(true);
    console.log("Hero image loaded successfully");
  };
  
  const handleError = () => {
    console.error("Failed to load hero image");
    setHasError(true);
  };
  
  return (
    <div className="md:w-1/2 flex justify-center px-4 md:px-0">
      <div className="w-full max-w-lg relative rounded-lg shadow-xl overflow-hidden bg-gray-100">
        {/* Estado de carregamento */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
            <Skeleton className="w-full h-full absolute" />
            <ImageIcon className="h-10 w-10 text-gray-400" />
          </div>
        )}
        
        <img
          src={imagePath}
          alt="VizinhoMarket - Condomínio"
          className={`w-full aspect-[4/3] object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
        />

        {/* Estado de erro */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-20">
            <div className="bg-background/80 p-3 rounded-full">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroImage;
