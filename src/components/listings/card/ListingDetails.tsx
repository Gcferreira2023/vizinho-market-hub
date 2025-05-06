
import { Eye } from "lucide-react";
import { useMobile } from "@/hooks/useMobile";

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
  const isMobile = useMobile();
  
  // Formatação de preço para melhor legibilidade
  const formattedPrice = typeof price === 'number' 
    ? `R$ ${price.toFixed(2)}` 
    : price;
  
  return (
    <div className={`p-3 ${isMobile ? 'p-2' : 'p-3'}`}>
      <h3 className={`font-medium ${isMobile ? 'text-xs leading-tight' : 'text-sm'} line-clamp-2 mb-1`}>
        {title}
      </h3>
      
      <div className="flex justify-between items-end">
        <p className={`text-primary font-bold ${isMobile ? 'text-sm' : 'text-base'}`}>
          {formattedPrice}
        </p>
        
        {viewCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Eye size={isMobile ? 12 : 14} />
            <span className={isMobile ? 'text-[10px]' : 'text-xs'}>{viewCount}</span>
          </div>
        )}
      </div>
      
      {location && (
        <p className={`text-gray-500 ${isMobile ? 'text-[10px] line-clamp-1' : 'text-xs'} mt-1`}>
          {location}
        </p>
      )}
    </div>
  );
};

export default ListingDetails;
