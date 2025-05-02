
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ListingCardProps {
  id: string;
  title: string;
  price: number | "A combinar";
  imageUrl: string;
  category: string;
  type: "produto" | "serviço";
  rating?: number;
  location: string;
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
}: ListingCardProps) => {
  return (
    <Link to={`/anuncio/${id}`} className="block">
      <div className="card-hover rounded-lg overflow-hidden border bg-white">
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          <Badge
            className="absolute top-2 left-2"
            variant={type === "produto" ? "default" : "secondary"}
          >
            {type}
          </Badge>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-lg mb-1 line-clamp-2" title={title}>
            {title}
          </h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">{category}</span>
            {rating !== undefined && (
              <div className="flex items-center">
                <Star size={16} className="text-yellow-400 fill-yellow-400 mr-1" />
                <span className="text-sm font-medium">{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg text-primary">
              {typeof price === "number" ? `R$ ${price.toFixed(2)}` : price}
            </span>
            <span className="text-xs text-gray-500">{location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
