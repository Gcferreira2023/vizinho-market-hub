
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useImageLoader } from "./useImageLoader";
import FavoriteButton from "../FavoriteButton";

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
  const {
    imgError,
    imgLoaded,
    isVisible,
    actualImageUrl,
    handleImageLoad,
    handleImageError
  } = useImageLoader({
    imageUrl,
    isMockListing,
    lazyLoad,
    id,
    onImageLoad
  });

  return (
    <div className="relative h-48 overflow-hidden bg-gray-100">
      {(!imgLoaded && isVisible) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-full h-full absolute" />
        </div>
      )}
      
      {isVisible && (
        <img
          src={imgError ? "/placeholder.svg" : actualImageUrl}
          alt={title}
          className={`w-full h-full object-cover transition-all duration-300 hover:scale-105 
            ${status === "vendido" ? "opacity-70" : ""}
            ${!imgLoaded ? "opacity-0" : "opacity-100"}`}
          loading={lazyLoad ? "lazy" : "eager"}
          onLoad={handleImageLoad}
          onError={handleImageError}
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
        <StatusBadgeComponent status={status} />
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
      
      {/* Badge de condomínio */}
      {condominiumName && (
        <CondominiumBadge 
          condominiumName={condominiumName}
          isUserCondominium={isUserCondominium}
        />
      )}
    </div>
  );
};

// StatusBadge component
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

// CondominiumBadge component
import { MapPin } from "lucide-react";

const CondominiumBadge = ({ 
  condominiumName, 
  isUserCondominium 
}: { 
  condominiumName: string, 
  isUserCondominium: boolean 
}) => {
  return (
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
  );
};

export default ListingImage;
