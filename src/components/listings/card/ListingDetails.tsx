
import { Eye } from "lucide-react";

interface ListingDetailsProps {
  title: string;
  price: number | string;
  rating?: number;
  location: string;
  viewCount?: number;
}

const ListingDetails = ({ 
  title, 
  price, 
  rating, 
  location,
  viewCount = 0
}: ListingDetailsProps) => {
  return (
    <div className="p-3">
      <h3 className="font-medium text-sm line-clamp-2 mb-1">{title}</h3>
      <div className="flex justify-between items-end">
        <p className="text-primary font-bold text-base">
          {typeof price === 'number' 
            ? `R$ ${price.toFixed(2)}` 
            : price}
        </p>
        
        {viewCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Eye size={14} />
            <span>{viewCount}</span>
          </div>
        )}
      </div>
      {location && (
        <p className="text-gray-500 text-xs mt-1">{location}</p>
      )}
    </div>
  );
};

export default ListingDetails;
