
import React from "react";
import FavoriteButton from "../../listings/FavoriteButton";
import { ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useListingImage } from "./hooks/useListingImage";
import { 
  TypeBadge, 
  CategoryAndStatusBadges, 
  CondominiumBadge, 
  MockIndicator 
} from "./components/ListingBadges";
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
  const {
    isLoaded,
    hasError,
    isVisible,
    imgSrc,
    handleImageLoad,
    handleImageError
  } = useListingImage({
    id,
    imageUrl,
    category,
    type,
    isMockListing,
    lazyLoad,
    onImageLoad
  });

  return (
    <div className="relative h-full overflow-hidden bg-gray-100">
      {/* Loading state - mostrado apenas enquanto a imagem não é carregada */}
      {!isLoaded && isVisible && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
          <Skeleton className="w-full h-full absolute" />
          <ImageIcon className="w-8 h-8 text-muted-foreground opacity-50 z-20" />
        </div>
      )}
      
      {/* Main image using OptimizedImage component */}
      {isVisible && (
        <OptimizedImage
          src={imgSrc}
          alt={title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={handleImageLoad}
          fallbackSrc="/lovable-uploads/a761c01e-ede6-4e1b-b09e-cd61fdb6b0c6.png"
          priority={!lazyLoad}
        />
      )}
      
      {/* Type badge */}
      <TypeBadge type={type} />
      
      {/* Category and status badges */}
      <CategoryAndStatusBadges category={category} status={status} />
      
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
      <CondominiumBadge 
        condominiumName={condominiumName} 
        isUserCondominium={isUserCondominium} 
      />
      
      {/* Mock indicator */}
      <MockIndicator isMockListing={isMockListing} />
      
      {/* Só mostra skeleton enquanto não estiver visível */}
      {!isVisible && (
        <div className="flex items-center justify-center w-full h-full">
          <Skeleton className="w-full h-full absolute" />
          <ImageIcon className="h-8 w-8 text-gray-400" />
        </div>
      )}
    </div>
  );
};

export default ListingImage;
