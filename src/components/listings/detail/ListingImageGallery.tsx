
import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge, { ListingStatus } from "../StatusBadge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

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
  
  // Se não houver imagens, mostra um placeholder
  if (images.length === 0) {
    return (
      <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
        <p className="text-gray-500">Sem imagens disponíveis</p>
      </div>
    );
  }
  
  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };
  
  const handleImageError = (index: number) => {
    setErrorImages(prev => ({ ...prev, [index]: true }));
    setLoadedImages(prev => ({ ...prev, [index]: true })); // Marcar como carregada mesmo com erro
  };
  
  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
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
          
          {/* Skeleton durante carregamento */}
          {!loadedImages[activeIndex] && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="w-full h-full absolute" />
            </div>
          )}
          
          <img 
            src={errorImages[activeIndex] ? "/placeholder.svg" : images[activeIndex]} 
            alt={`${title} - Imagem ${activeIndex + 1}`}
            className={`w-full h-full object-contain transition-opacity duration-300 ${
              loadedImages[activeIndex] ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => handleImageLoad(activeIndex)}
            onError={() => handleImageError(activeIndex)}
            loading="lazy"
          />
          
          {/* Mostrar ícone de erro se a imagem falhar */}
          {errorImages[activeIndex] && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gray-200/80 p-4 rounded-full">
                <ImageOff className="h-8 w-8 text-gray-500" />
              </div>
            </div>
          )}
          
          {/* Controles de navegação */}
          {images.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full bg-white/80 hover:bg-white z-10"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-white/80 hover:bg-white z-10"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </AspectRatio>
      </div>
      
      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="flex overflow-x-auto space-x-2 py-2 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-20 h-20 rounded overflow-hidden flex-shrink-0 relative ${
                index === activeIndex ? 'ring-2 ring-primary ring-offset-2' : 'opacity-70'
              }`}
            >
              {!loadedImages[index] && (
                <Skeleton className="absolute inset-0" />
              )}
              <img 
                src={errorImages[index] ? "/placeholder.svg" : image} 
                alt={`Miniatura ${index + 1}`}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  loadedImages[index] ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => handleImageLoad(index)}
                onError={() => handleImageError(index)}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingImageGallery;
