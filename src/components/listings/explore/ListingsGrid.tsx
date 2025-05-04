
import { ListingStatus } from "@/components/listings/StatusBadge";
import ListingCard from "@/components/listings/ListingCard";
import EmptyListingsState from "./EmptyListingsState";

interface Listing {
  id: string;
  title: string;
  price: number | string;
  imageUrl: string;
  category: string;
  type: "produto" | "serviço";
  rating?: number;
  location: string;
  status: ListingStatus;
}

interface ListingsGridProps {
  listings: Listing[];
  searchTerm?: string;
}

const ListingsGrid = ({ listings, searchTerm }: ListingsGridProps) => {
  if (listings.length === 0) {
    return <EmptyListingsState searchTerm={searchTerm} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} {...listing} />
      ))}
    </div>
  );
};

export default ListingsGrid;
