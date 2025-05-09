
import { Link } from "react-router-dom";
import { Edit } from "lucide-react";
import ListingCard from "@/components/listings/ListingCard";
import { ListingStatus, mapStatusFromDB } from "@/components/listings/StatusBadge";
import { Listing } from "@/types/listing";
import ListingMetrics from "./ListingMetrics";

interface ListingCardGridProps {
  listings: Listing[];
  images: Record<string, string>;
  userLocation: string;
  translateStatus: (status: string) => ListingStatus;
  condominiumName?: string;
  isUserCondominium?: boolean;
}

const ListingCardGrid = ({ 
  listings, 
  images, 
  userLocation, 
  translateStatus,
  condominiumName,
  isUserCondominium = true
}: ListingCardGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {listings.map((listing) => (
        <div key={listing.id} className="relative group">
          <div className="flex flex-col h-full">
            <ListingCard
              id={listing.id}
              title={listing.title}
              price={listing.price}
              imageUrl={images[listing.id] || '/placeholder.svg'}
              category={listing.category}
              type={listing.type}
              location={userLocation}
              status={translateStatus(listing.status as string)}
              linkTo={`/anuncio/${listing.id}`}
              viewCount={listing.viewCount}
              condominiumName={condominiumName}
              isUserCondominium={isUserCondominium}
              lazyLoad={true}
            />
            
            <div className="px-3 py-2 border-t border-gray-100">
              <ListingMetrics 
                viewCount={listing.viewCount || 0} 
                createdAt={listing.created_at || ''}
                condensed={true}
                className="text-xs"
              />
            </div>
          </div>
          
          <Link 
            to={`/editar-anuncio/${listing.id}`}
            className="absolute top-2 right-2 z-20 bg-white/90 hover:bg-white text-gray-800 py-1 px-3 rounded-md flex items-center shadow-sm"
          >
            <Edit size={16} className="mr-1" />
            <span>Editar</span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ListingCardGrid;
