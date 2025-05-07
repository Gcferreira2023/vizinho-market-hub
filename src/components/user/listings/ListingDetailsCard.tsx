
import { useState } from "react";
import { Link } from "react-router-dom";
import { Edit, ChevronDown, ChevronUp, Eye, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Listing } from "@/types/listing";
import { ListingStatus } from "@/components/listings/StatusBadge";
import ListingMetrics from "./ListingMetrics";
import { useImageLoader } from "@/hooks/useImageLoader";

interface ListingDetailsCardProps {
  listing: Listing;
  imageUrl: string;
  formatDate: (date: string) => string;
  translateStatus: (status: string) => ListingStatus;
  condominiumName?: string;
  isUserCondominium?: boolean;
}

const ListingDetailsCard = ({ 
  listing,
  imageUrl,
  formatDate,
  translateStatus,
  condominiumName,
  isUserCondominium = true
}: ListingDetailsCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const { imgSrc, handleLoad, handleError } = useImageLoader({
    src: imageUrl,
    fallbackSrc: "/lovable-uploads/a761c01e-ede6-4e1b-b09e-cd61fdb6b0c6.png"
  });

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 relative">
          <img 
            src={imgSrc} 
            alt={listing.title}
            className="w-full h-48 md:h-full object-cover"
            onLoad={handleLoad}
            onError={handleError}
          />
          {condominiumName && (
            <Badge 
              variant="outline" 
              className={`absolute bottom-2 left-2 text-xs py-1 px-2 flex items-center gap-1 
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
          )}
        </div>
        
        <div className="p-4 flex-1">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{listing.title}</h3>
              <Link 
                to={`/editar-anuncio/${listing.id}`}
                className="bg-primary/10 hover:bg-primary/20 text-primary py-1 px-3 rounded-md flex items-center text-sm"
              >
                <Edit size={14} className="mr-1" />
                <span>Editar</span>
              </Link>
            </div>
            <p className="text-sm text-gray-500">{formatDate(listing.created_at || '')}</p>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline">
              {listing.category}
            </Badge>
            <Badge variant={listing.type === "produto" ? "default" : "secondary"}>
              {listing.type}
            </Badge>
            <Badge variant={
              translateStatus(listing.status as string) === "disponível" ? "outline" : 
              translateStatus(listing.status as string) === "reservado" ? "secondary" : 
              "destructive"
            }>
              {translateStatus(listing.status as string)}
            </Badge>
          </div>
          
          <div className="flex justify-between items-end">
            <span className="font-bold text-lg text-primary">
              {typeof listing.price === "number" ? `R$ ${Number(listing.price).toFixed(2)}` : listing.price}
            </span>
            
            <div className="flex gap-4 items-center text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <Eye size={16} />
                <span>{listing.viewCount || 0} visualizações</span>
              </div>
              
              <Link 
                to={`/anuncio/${listing.id}`}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
              >
                Ver Anúncio
              </Link>
            </div>
          </div>
          
          {/* Barra de progresso simples - simulando conversão */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${Math.min(100, listing.viewCount ? (listing.viewCount / 20) * 100 : 5)}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Desempenho do anúncio</span>
              <span>{Math.min(100, listing.viewCount ? Math.round((listing.viewCount / 20) * 100) : 5)}%</span>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3 flex items-center justify-center"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <span>Menos detalhes</span>
                <ChevronUp size={16} className="ml-1" />
              </>
            ) : (
              <>
                <span>Mais detalhes</span>
                <ChevronDown size={16} className="ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
      
      {expanded && (
        <CardContent className="border-t pt-4">
          <ListingMetrics 
            viewCount={listing.viewCount || 0} 
            createdAt={listing.created_at || ''}
            showChart={true}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default ListingDetailsCard;
