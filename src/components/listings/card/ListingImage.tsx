
import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import FavoriteButton from "../FavoriteButton";
import { Image, ImageOff, MapPin } from "lucide-react";
import OptimizedImage from "@/components/ui/optimized-image";

interface ListingImageProps {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  type: "produto" | "serviço";
  status: string;
  isMockListing: boolean;
  condominiumName?: string;
  isUserCondominium?: boolean;
  lazyLoad: boolean;
  onImageLoad?: () => void;
}

const ListingImage = ({
  id,
  title,
  imageUrl,
  category,
  type,
  status,
  isMockListing,
  condominiumName,
  isUserCondominium = false,
  lazyLoad,
  onImageLoad
}: ListingImageProps) => {
  // Para imagens de demonstração, sempre use o placeholder
  const actualImageUrl = isMockListing ? '/placeholder.svg' : imageUrl || '/placeholder.svg';
  
  const [isVisible, setIsVisible] = useState(!lazyLoad);

  // Log para debug
  useEffect(() => {
    console.log(`ListingImage ${id}: usando imageUrl: ${actualImageUrl}, isMock: ${isMockListing}`);
  }, [id, actualImageUrl, isMockListing]);

  // Lazy loading com Intersection Observer
  useEffect(() => {
    if (!lazyLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const currentCard = document.getElementById(`listing-card-${id}`);
    if (currentCard) {
      observer.observe(currentCard);
    }

    return () => observer.disconnect();
  }, [id, lazyLoad]);

  // Status badge component
  const StatusBadgeComponent = ({ status }: { status: string }) => {
    return (
      <Badge 
        variant="outline" 
        className={`bg-white/80 backdrop-blur-sm ${
          status === "disponível" ? "text-green-700" :
          status === "reservado" ? "text-amber-700" :
          "text-gray-700"
        }`}
      >
        {status}
      </Badge>
    );
  };

  return (
    <div className="relative h-full overflow-hidden bg-gray-100">
      {isVisible ? (
        <>
          <OptimizedImage
            src={actualImageUrl}
            alt={title}
            className="w-full h-full"
            objectFit="cover"
            onLoad={onImageLoad}
            fallbackSrc="/placeholder.svg"
            priority={!lazyLoad}
          />
          
          {/* Type badge */}
          <Badge
            className="absolute top-2 left-2 z-10"
            variant={type === "produto" ? "default" : "secondary"}
          >
            {type}
          </Badge>
          
          {/* Category and status badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 items-end z-10">
            <Badge 
              variant="outline" 
              className="bg-white/80 backdrop-blur-sm text-gray-800"
            >
              {category}
            </Badge>
            <StatusBadgeComponent status={status} />
          </div>
          
          {/* Favorite button */}
          <div className="absolute bottom-2 right-2 z-10">
            <FavoriteButton
              listingId={id}
              size="sm"
              variant="ghost"
              className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
            />
          </div>
          
          {/* Condominium badge */}
          {condominiumName && (
            <div className="absolute bottom-2 left-2 z-10">
              <Badge 
                variant="outline" 
                className={`text-xs py-1 px-2 flex items-center gap-1 
                  ${isUserCondominium 
                    ? 'bg-primary/20 text-primary border-primary/30' 
                    : 'bg-white/80 text-gray-700 border-gray-300'}`}
              >
                <MapPin className="h-3 w-3" />
                {condominiumName}
                {isUserCondominium && (
                  <span className="bg-primary/20 text-primary text-[10px] px-1 rounded ml-1">Seu</span>
                )}
              </Badge>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <Skeleton className="w-full h-full absolute" />
          <Image className="h-8 w-8 text-gray-400" />
        </div>
      )}
    </div>
  );
};

export default ListingImage;
