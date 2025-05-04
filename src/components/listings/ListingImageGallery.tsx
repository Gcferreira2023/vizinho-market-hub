
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const isMobile = useIsMobile();
  
  // Garanta que temos uma matriz de imagens válida, usando um placeholder como fallback
  const displayImages = images && images.length > 0 ? images : ['/placeholder.svg'];
  
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
    setImgErrors(prev => ({...prev, [index]: true}));
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
          <img
            src={imgErrors[currentImage] ? "/placeholder.svg" : displayImages[currentImage]}
            alt={`${title} - Imagem ${currentImage + 1}`}
            className="w-full h-full object-contain"
            onError={() => handleImageError(currentImage)}
          />
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
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingImageGallery;
