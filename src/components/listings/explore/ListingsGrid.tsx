
import { ListingStatus } from "@/components/listings/StatusBadge";
import ListingCard from "@/components/listings/ListingCard";

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
}

const ListingsGrid = ({ listings }: ListingsGridProps) => {
  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">
          Nenhum anúncio encontrado
        </h3>
        <p className="text-gray-500">
          Tente ajustar seus filtros ou busque por outro termo.
        </p>
      </div>
    );
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
