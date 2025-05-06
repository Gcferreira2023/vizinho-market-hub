
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import ListingImage from "./ListingImage";
import ListingDetails from "./ListingDetails";
import { ListingStatus } from "../StatusBadge";
import { useEffect } from "react";
import { useMobile } from "@/hooks/useMobile";

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
  const isMobile = useMobile();
  
  // Use the provided linkTo or determine based on whether it's a mock listing
  const linkPath = linkTo || (isMockListing ? "/explorar" : `/anuncio/${id}`);
  
  // Debug log for image URL
  useEffect(() => {
    console.log(`ListingCard ${id} rendering with image URL: ${imageUrl}`);
    console.log(`Is mock listing: ${isMockListing}, link: ${linkPath}`);
  }, [id, imageUrl, isMockListing, linkPath]);
  
  // Definir tamanho da imagem com base no dispositivo
  const imageHeight = isMobile ? "h-40" : "h-48";
  
  return (
    <Card 
      id={`listing-card-${id}`} 
      className="card-hover overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-md"
    >
      <Link 
        to={linkPath} 
        className="block h-full no-underline"
        aria-label={`Ver detalhes de ${title}`}
      >
        <div className={`relative ${imageHeight} overflow-hidden`}>
          <ListingImage 
            id={id}
            title={title}
            imageUrl={imageUrl}
            category={category}
            type={type}
            status={status}
            isMockListing={isMockListing}
            condominiumName={condominiumName}
            isUserCondominium={isUserCondominium}
            lazyLoad={lazyLoad}
            onImageLoad={onImageLoad}
          />
        </div>
        
        <ListingDetails 
          title={title}
          price={price}
          rating={rating}
          location={location}
          viewCount={viewCount}
        />
      </Link>
    </Card>
  );
};

export default ListingCard;
