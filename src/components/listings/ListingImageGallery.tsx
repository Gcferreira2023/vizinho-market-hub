
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge, { ListingStatus } from "./StatusBadge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useIsMobile } from "@/hooks/use-mobile";

interface ListingImageGalleryProps {
  images: string[];
  title: string;
  status?: ListingStatus;
}

const ListingImageGallery = ({ 
  images = [], 
  title, 
  status = "disponível" 
}: ListingImageGalleryProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});
  const isMobile = useIsMobile();
  
  // Garantir que temos imagens válidas, usando placeholder como fallback
  const displayImages = images && images.length > 0 ? images : ['/placeholder.svg'];
  
  // Limpar estados quando as imagens mudam
  useEffect(() => {
    setImgErrors({});
    setImagesLoaded({});
    setCurrentImage(0);
    console.log("Gallery images updated:", displayImages);
  }, [images]);
  
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % displayImages.length);
  };
  
  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };
  
  const getOverlayStyle = () => {
    if (status === "vendido") {
      return "absolute inset-0 bg-gray-900/50 flex items-center justify-center z-10";
    } else if (status === "reservado") {
      return "absolute inset-0 bg-yellow-900/30 flex items-center justify-center z-10";
    }
    return "";
  };

  const handleImageError = (index: number) => {
    console.error(`Error loading gallery image at index ${index}:`, displayImages[index]);
    setImgErrors(prev => ({...prev, [index]: true}));
  };

  const handleImageLoad = (index: number) => {
    console.log(`Gallery image loaded at index ${index}:`, displayImages[index]);
    setImagesLoaded(prev => ({...prev, [index]: true}));
  };

  return (
    <div className="mb-6">
      {/* Imagem Principal */}
      <div className="relative w-full overflow-hidden bg-gray-100 rounded-lg mb-2">
        <AspectRatio ratio={4/3} className="bg-muted">
          {status !== "disponível" && (
            <div className={getOverlayStyle()}>
              <StatusBadge 
                status={status} 
                className="transform scale-150 bg-white/90 text-lg px-6 py-2"
              />
            </div>
          )}
          
          {/* Loading indicator */}
          {!imagesLoaded[currentImage] && !imgErrors[currentImage] && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
              <div className="animate-pulse rounded-full bg-muted p-4">
                <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              </div>
            </div>
          )}
          
          <img
            src={imgErrors[currentImage] ? "/placeholder.svg" : displayImages[currentImage]}
            alt={`${title} - Imagem ${currentImage + 1}`}
            className="w-full h-full object-contain"
            onError={() => handleImageError(currentImage)}
            onLoad={() => handleImageLoad(currentImage)}
          />
          
          {/* Error indicator */}
          {imgErrors[currentImage] && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
              <div className="bg-white/80 p-3 rounded-full">
                <ImageOff className="h-8 w-8 text-gray-500" />
              </div>
            </div>
          )}
          
          {displayImages.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
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
        <div className={`flex gap-2 overflow-x-auto pb-2 ${isMobile ? "scrollbar-hide -mx-4 px-4" : ""}`}>
          {displayImages.map((image, index) => (
            <button
              key={index}
              className={`relative ${isMobile ? "w-16 h-16" : "w-20 h-20"} flex-shrink-0 rounded ${
                currentImage === index
                  ? "ring-2 ring-primary ring-offset-2"
                  : "opacity-70"
              }`}
              onClick={() => setCurrentImage(index)}
            >
              <img
                src={imgErrors[index] ? "/placeholder.svg" : image}
                alt={`${title} - Miniatura ${index + 1}`}
                className="w-full h-full object-cover rounded"
                onError={() => handleImageError(index)}
                onLoad={() => handleImageLoad(index)}
              />
              
              {imgErrors[index] && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200/50 rounded">
                  <ImageOff className="h-4 w-4 text-gray-500" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingImageGallery;
