
import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import FavoriteButton from "../FavoriteButton";
import { Image, MapPin } from "lucide-react";
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
  // Se for um anúncio simulado, sempre use o placeholder
  // Se não for simulado mas não tiver imagem, use o placeholder também
  const imgSrc = isMockListing 
    ? '/placeholder.svg' 
    : (imageUrl && imageUrl !== "" ? imageUrl : '/placeholder.svg');
  
  const [isVisible, setIsVisible] = useState(!lazyLoad);
  
  // Para debug, log da fonte da imagem
  useEffect(() => {
    console.log(`Rendering listing ${id}, isMock: ${isMockListing}, imageUrl: ${imgSrc}`);
  }, [id, imgSrc, isMockListing]);

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

  const handleImageLoad = () => {
    console.log(`Image loaded successfully for listing ${id}: ${imgSrc}`);
    if (onImageLoad) onImageLoad();
  };

  // Badge do status
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
          {/* Usar o componente OptimizedImage atualizado */}
          <OptimizedImage
            src={imgSrc}
            alt={title}
            className="w-full h-full"
            objectFit="cover"
            fallbackSrc="/placeholder.svg"
            onLoad={handleImageLoad}
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
          
          {/* Mock indicator */}
          {isMockListing && (
            <Badge 
              variant="outline" 
              className="absolute top-2 left-20 z-10 bg-amber-100 text-amber-800 border-amber-200"
            >
              Ilustrativo
            </Badge>
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
