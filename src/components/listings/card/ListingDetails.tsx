
import { Star, Eye } from "lucide-react";

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
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{location}</span>
            {viewCount > 0 && (
              <ViewCounter viewCount={viewCount} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ViewCounter component
const ViewCounter = ({ viewCount }: { viewCount: number }) => {
  return (
    <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
      <Eye size={12} />
      {viewCount} {viewCount === 1 ? 'visualização' : 'visualizações'}
    </span>
  );
};

export default ListingDetails;
