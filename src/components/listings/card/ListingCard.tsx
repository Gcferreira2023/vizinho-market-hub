
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import ListingImage from "./ListingImage";
import ListingDetails from "./ListingDetails";
import { ListingStatus } from "../StatusBadge";
import { useEffect, useState } from "react";
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
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Determinar o caminho correto para o link
  const linkPath = linkTo || (isMockListing ? "/explorar" : `/anuncio/${id}`);
  
  // Para anúncios ilustrativos, sempre use o placeholder
  // Para anúncios reais, use a imagem fornecida ou placeholder se não houver imagem
  const imgSrc = isMockListing 
    ? '/placeholder.svg' 
    : (imageUrl && imageUrl !== "" ? imageUrl : '/placeholder.svg');
  
  // Log de debug para a URL da imagem
  useEffect(() => {
    console.log(`ListingCard ${id}: usando ${isMockListing ? 'mock' : 'real'} imagem: ${imgSrc}`);
  }, [id, imageUrl, isMockListing, imgSrc]);
  
  // Definir altura da imagem com base no dispositivo
  const imageHeight = isMobile ? "h-40" : "h-48";
  
  // Gerenciar callback de carregamento da imagem
  const handleImageLoaded = () => {
    setImageLoaded(true);
    if (onImageLoad) onImageLoad();
    console.log(`ListingCard ${id}: imagem carregada com sucesso`);
  };
  
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
            imageUrl={imgSrc}
            category={category}
            type={type}
            status={status}
            isMockListing={isMockListing}
            condominiumName={condominiumName}
            isUserCondominium={isUserCondominium}
            lazyLoad={lazyLoad}
            onImageLoad={handleImageLoaded}
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
