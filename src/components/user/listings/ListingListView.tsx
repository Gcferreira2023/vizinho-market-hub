
import { Link } from "react-router-dom";
import { Edit, Eye, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Listing } from "@/types/listing";
import { ListingStatus, mapStatusFromDB } from "@/components/listings/StatusBadge";
import ListingDetailsCard from "./ListingDetailsCard";

interface ListingListViewProps {
  listings: Listing[];
  images: Record<string, string>;
  formatDate: (date: string) => string;
  translateStatus: (status: string) => ListingStatus;
  condominiumName?: string;
  isUserCondominium?: boolean;
}

const ListingListView = ({ 
  listings, 
  images, 
  formatDate, 
  translateStatus,
  condominiumName,
  isUserCondominium = true 
}: ListingListViewProps) => {
  return (
    <div className="space-y-4">
      {listings.map((listing) => (
        <ListingDetailsCard 
          key={listing.id}
          listing={listing}
          imageUrl={images[listing.id] || '/placeholder.svg'}
          formatDate={formatDate}
          translateStatus={translateStatus}
          condominiumName={condominiumName}
          isUserCondominium={isUserCondominium}
        />
      ))}
    </div>
  );
};

export default ListingListView;
