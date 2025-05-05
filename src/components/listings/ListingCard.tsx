
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import StatusBadge, { ListingStatus } from "./StatusBadge";
import FavoriteButton from "./FavoriteButton";
import { Skeleton } from "@/components/ui/skeleton";

interface ListingCardProps {
  id: string;
  title: string;
  price: number | string;
  imageUrl: string;
  category: string;
  type: "produto" | "serviço";
  rating?: number;
  location: string;
  status?: ListingStatus;
  linkTo?: string;
  isMockListing?: boolean;
  condominiumName?: string;
  isUserCondominium?: boolean;
  viewCount?: number;
  lazyLoad?: boolean;
  onImageLoad?: () => void;
}

const ListingCard = ({
  id,
  title,
  price,
  imageUrl,
  category,
  type,
  rating,
  location,
  status = "disponível",
  linkTo,
  isMockListing = false,
  condominiumName,
  isUserCondominium = false,
  viewCount = 0,
  lazyLoad = false,
  onImageLoad
}: ListingCardProps) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazyLoad);
  
  // Lazy loading observer
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

    return () => {
      observer.disconnect();
    };
  }, [id, lazyLoad]);
  
  const handleImageLoad = () => {
    setImgLoaded(true);
    if (onImageLoad) onImageLoad();
  };
  
  // Use the provided linkTo or determine based on whether it's a mock listing
  const linkPath = linkTo || (isMockListing ? "/explorar" : `/anuncio/${id}`);
  
  // Log the image URL for debugging
  useEffect(() => {
    if (isVisible && imageUrl) {
      console.log(`Card ${id} loading image: ${imageUrl}`);
    }
  }, [isVisible, imageUrl, id]);
  
  return (
    <Card id={`listing-card-${id}`} className="card-hover overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-md">
      <Link to={linkPath} className="block h-full no-underline">
        <div className="relative h-48 overflow-hidden bg-gray-100">
          {(!imgLoaded && isVisible) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="w-full h-full absolute" />
            </div>
          )}
          
          {isVisible && (
            <img
              src={imgError ? "/placeholder.svg" : imageUrl}
              alt={title}
              className={`w-full h-full object-cover transition-all duration-300 hover:scale-105 
                ${status === "vendido" ? "opacity-70" : ""}
                ${!imgLoaded ? "opacity-0" : "opacity-100"}`}
              loading={lazyLoad ? "lazy" : "eager"}
              onLoad={handleImageLoad}
              onError={(e) => {
                console.error(`Image error loading ${imageUrl}, using placeholder`);
                setImgError(true);
                handleImageLoad();
              }}
            />
          )}
          
          <Badge
            className="absolute top-2 left-2 z-10"
            variant={type === "produto" ? "default" : "secondary"}
          >
            {type}
          </Badge>
          
          <div className="absolute top-2 right-2 flex flex-col gap-2 items-end z-10">
            <Badge 
              variant="outline" 
              className="bg-white/80 backdrop-blur-sm text-gray-800"
            >
              {category}
            </Badge>
            <StatusBadge status={status} className="bg-white/80 backdrop-blur-sm" />
          </div>
          
          {/* Botão de favorito */}
          <div className="absolute bottom-2 right-2 z-10">
            <FavoriteButton
              listingId={id}
              size="sm"
              variant="ghost"
              className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
            />
          </div>
          
          {/* Badge de condomínio (adicionado) */}
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
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-medium text-lg mb-1 line-clamp-2" title={title}>
            {title}
          </h3>
          <div className="mt-auto">
            {rating !== undefined && (
              <div className="flex items-center mb-2">
                <Star size={16} className="text-yellow-400 fill-yellow-400 mr-1" />
                <span className="text-sm font-medium">{rating.toFixed(1)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg text-primary">
                {typeof price === "number" ? `R$ ${price.toFixed(2)}` : price}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{location}</span>
                {viewCount > 0 && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <Eye size={12} />
                    {viewCount} {viewCount === 1 ? 'visualização' : 'visualizações'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default ListingCard;
