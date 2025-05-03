
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import StatusBadge, { ListingStatus } from "./StatusBadge";

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
}: ListingCardProps) => {
  return (
    <Link to={`/anuncio/${id}`} className="block h-full">
      <Card className="card-hover overflow-hidden h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-300 hover:scale-105 ${status === "vendido" ? "opacity-70" : ""}`}
            onError={(e) => {
              console.log("Image error, using placeholder");
              (e.target as HTMLImageElement).src = '/placeholder.svg';
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
              <span className="text-xs text-gray-500">{location}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ListingCard;
