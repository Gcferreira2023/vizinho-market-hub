
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import StatusSelector from "@/components/listings/StatusSelector";
import { ListingStatus } from "@/components/listings/StatusBadge";

interface ListingHeaderProps {
  title: string;
  category: string;
  type: "produto" | "serviço";
  rating: number;
  price: number | string;
  status: ListingStatus;
  adId: string;
  userId?: string;
  ownerId?: string;
  onStatusChange: (newStatus: ListingStatus) => void;
}

const ListingHeader = ({
  title,
  category,
  type,
  rating,
  price,
  status,
  adId,
  userId,
  ownerId,
  onStatusChange
}: ListingHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Badge
            variant={type === "produto" ? "default" : "secondary"}
          >
            {type}
          </Badge>
          <span className="text-sm text-gray-500">{category}</span>
        </div>
        <StatusSelector 
          adId={adId}
          currentStatus={status}
          onStatusChange={onStatusChange}
          userId={userId}
          ownerId={ownerId}
        />
      </div>
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <div className="flex items-center gap-2 mb-4">
        <Star
          size={18}
          className="text-yellow-400 fill-yellow-400"
        />
        <span className="font-semibold">{rating}</span>
      </div>

      <div className="mb-6">
        <span className="text-2xl font-bold text-primary">
          {typeof price === "number"
            ? `R$ ${price.toFixed(2)}`
            : price}
        </span>
      </div>
    </>
  );
};

export default ListingHeader;
