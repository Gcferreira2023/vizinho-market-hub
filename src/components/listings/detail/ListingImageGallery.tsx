
import { useState } from "react";
import { ChevronLeft, ChevronRight, Image, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge, { ListingStatus } from "../StatusBadge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import OptimizedImage from "@/components/ui/optimized-image";

interface ListingImageGalleryProps {
  images: string[];
  title?: string;
  status?: ListingStatus;
}

export const ListingImageGallery = ({ 
  images = [], 
  title = "Imagem do anúncio", 
  status = "disponível" 
}: ListingImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [errorImages, setErrorImages] = useState<Record<number, boolean>>({});
  
  // Use placeholder para arrays de imagem vazios ou imagens vazias
  const displayImages = images && images.length > 0 && images.some(img => img && img !== "") 
    ? images.filter(img => img && img !== "") 
    : ['/placeholder.svg'];
  
  // Log para debug
  console.log("Gallery images:", displayImages);
  
  const handleImageLoad = (index: number) => {
    console.log(`Gallery image ${index} loaded:`, displayImages[index]);
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };
  
  const handleImageError = (index: number) => {
    console.error(`Gallery image ${index} failed to load:`, displayImages[index]);
    setErrorImages(prev => ({ ...prev, [index]: true }));
  };
  
  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % displayImages.length);
  };
  
  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };
  
  const getOverlayStyle = () => {
    if (status === "vendido") {
      return "absolute inset-0 bg-gray-900/50 flex items-center justify-center z-10";
    } else if (status === "reservado") {
      return "absolute inset-0 bg-yellow-900/30 flex items-center justify-center z-10";
    }
    return "";
  };
  
  return (
    <div className="mb-6">
      {/* Imagem principal */}
      <div className="relative w-full overflow-hidden rounded-lg mb-2">
        <AspectRatio ratio={4/3} className="bg-muted">
          {/* Status overlay */}
          {status !== "disponível" && (
            <div className={getOverlayStyle()}>
              <StatusBadge 
                status={status} 
                className="transform scale-150 bg-white/90 text-lg px-6 py-2"
              />
            </div>
          )}
          
          {/* Usar OptimizedImage para a imagem principal */}
          <OptimizedImage
            src={errorImages[activeIndex] ? "/placeholder.svg" : displayImages[activeIndex]}
            alt={`${title} - Imagem ${activeIndex + 1}`}
            className="w-full h-full"
            objectFit="contain"
            fallbackSrc="/placeholder.svg"
            onLoad={() => handleImageLoad(activeIndex)}
          />
          
          {/* Controles de navegação */}
          {displayImages.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full bg-white/80 hover:bg-white z-30"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-white/80 hover:bg-white z-30"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </AspectRatio>
      </div>
      
      {/* Miniaturas */}
      {displayImages.length > 1 && (
        <div className="flex overflow-x-auto space-x-2 py-2 scrollbar-hide">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-20 h-20 rounded overflow-hidden flex-shrink-0 relative ${
                index === activeIndex ? 'ring-2 ring-primary ring-offset-2' : 'opacity-70'
              }`}
            >
              <OptimizedImage
                src={errorImages[index] ? "/placeholder.svg" : image}
                alt={`Miniatura ${index + 1}`}
                className="w-full h-full"
                objectFit="cover"
                fallbackSrc="/placeholder.svg"
                onLoad={() => handleImageLoad(index)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingImageGallery;
