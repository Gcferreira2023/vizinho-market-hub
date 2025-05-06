
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useIsMobile } from "@/hooks/use-mobile";

interface ListingImageGalleryProps {
  images: string[];
  title?: string;
}

const ListingImageGallery = ({ 
  images = []
}: ListingImageGalleryProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const isMobile = useIsMobile();
  
  // Ensure we have a valid array of images, using a placeholder as fallback
  const displayImages = images && images.length > 0 ? images : ['/placeholder.svg'];
  
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % displayImages.length);
  };
  
  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const handleImageError = (index: number) => {
    setImgErrors(prev => ({...prev, [index]: true}));
  };

  return (
    <div className="mb-6">
      {/* Main Image */}
      <div className="relative w-full overflow-hidden bg-gray-100 rounded-lg mb-2">
        <AspectRatio ratio={4/3} className="bg-muted">
          <img
            src={imgErrors[currentImage] ? "/placeholder.svg" : displayImages[currentImage]}
            alt={`Image ${currentImage + 1}`}
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

      {/* Thumbnails */}
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
                alt={`Thumbnail ${index + 1}`}
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
