
import { Link } from "react-router-dom";
import { Edit, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Listing } from "@/types/listing";
import { ListingStatus, mapStatusFromDB } from "@/components/listings/StatusBadge";

interface ListingListViewProps {
  listings: Listing[];
  images: Record<string, string>;
  formatDate: (date: string) => string;
  translateStatus: (status: string) => ListingStatus;
}

const ListingListView = ({ listings, images, formatDate, translateStatus }: ListingListViewProps) => {
  return (
    <div className="space-y-4">
      {listings.map((listing) => (
        <div key={listing.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/4">
              <img 
                src={images[listing.id] || '/placeholder.svg'} 
                alt={listing.title}
                className="w-full h-48 md:h-full object-cover"
                loading="lazy"
              />
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
                  mapStatusFromDB(listing.status as string) === "disponível" ? "outline" : 
                  mapStatusFromDB(listing.status as string) === "reservado" ? "secondary" : 
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
                    <span>{listing.view_count || 0} visualizações</span>
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
                    style={{ width: `${Math.min(100, listing.view_count ? (listing.view_count / 20) * 100 : 5)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Desempenho do anúncio</span>
                  <span>{Math.min(100, listing.view_count ? Math.round((listing.view_count / 20) * 100) : 5)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListingListView;
