
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
import { 
  ImageLoadingState, 
  ImageErrorState 
} from "./components/ImageLoadingState";

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
      {isVisible ? (
        <>
          {/* Loading state */}
          <ImageLoadingState isLoaded={isLoaded} />
          
          {/* Main image */}
          <img
            src={imgSrc}
            alt={title}
            className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading={lazyLoad ? "lazy" : "eager"}
            fetchpriority={lazyLoad ? "auto" : "high"}
          />
          
          {/* Error state */}
          <ImageErrorState hasError={hasError} />
          
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
        </>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <Skeleton className="w-full h-full absolute" />
          <ImageIcon className="h-8 w-8 text-gray-400" />
        </div>
      )}
    </div>
  );
};

export default ListingImage;
