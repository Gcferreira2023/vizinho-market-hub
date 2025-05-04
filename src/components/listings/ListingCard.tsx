
import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import StatusBadge, { ListingStatus } from "./StatusBadge";
import FavoriteButton from "./FavoriteButton";
import { useState } from "react";

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
  linkTo?: string; // Optional custom link path
  isMockListing?: boolean; // New prop to identify mock listings
  condominiumName?: string; // Added condominium name
  isUserCondominium?: boolean; // Flag if this is user's condominium
  viewCount?: number; // Added view count
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
  linkTo, // Use custom link if provided
  isMockListing = false, // Default to false
  condominiumName,
  isUserCondominium = false,
  viewCount = 0
}: ListingCardProps) => {
  const [imgError, setImgError] = useState(false);
  
  // Use the provided linkTo or determine based on whether it's a mock listing
  const linkPath = linkTo || (isMockListing ? "/explorar" : `/anuncio/${id}`);
  
  return (
    <Card className="card-hover overflow-hidden h-full flex flex-col">
      <Link to={linkPath} className="block h-full no-underline">
        <div className="relative h-48 overflow-hidden">
          <img
            src={imgError ? "/placeholder.svg" : imageUrl}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-300 hover:scale-105 ${status === "vendido" ? "opacity-70" : ""}`}
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover'
            }}
            onError={(e) => {
              console.log(`Image error loading ${imageUrl}, using placeholder`);
              setImgError(true);
            }}
          />
          <Badge
            className="absolute top-2 left-2"
            variant={type === "produto" ? "default" : "secondary"}
          >
            {type}
          </Badge>
          <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
            <Badge 
              variant="outline" 
              className="bg-white/80 backdrop-blur-sm text-gray-800"
            >
              {category}
            </Badge>
            <StatusBadge status={status} className="bg-white/80 backdrop-blur-sm" />
          </div>
          
          {/* Botão de favorito */}
          <div className="absolute bottom-2 right-2">
            <FavoriteButton
              listingId={id}
              size="sm"
              variant="ghost"
              className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
            />
          </div>
          
          {/* Badge de condomínio destacado */}
          {condominiumName && (
            <div className="absolute bottom-2 left-2">
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
                  <span className="bg-primary/20 text-primary text-[10px] px-1 rounded">Seu</span>
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
                  <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
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
