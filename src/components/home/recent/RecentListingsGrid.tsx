
import ListingCard from "../../listings/ListingCard";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

interface RecentListingsGridProps {
  listings: any[];
  isLoading: boolean;
  realListings: any[];
  showIllustrativeMessage: boolean;
}

const RecentListingsGrid = ({ 
  listings, 
  isLoading, 
  realListings,
  showIllustrativeMessage
}: RecentListingsGridProps) => {
  
  useEffect(() => {
    // Log the listings for debugging
    console.log("RecentListingsGrid - listings data:", listings);
    listings.forEach(listing => {
      console.log(`Listing ID: ${listing.id}, Image URL: ${listing.imageUrl}, Type: ${typeof listing.imageUrl}`);
    });
  }, [listings]);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-4 h-80 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings.map((listing) => {
          // Check if this is a mock listing
          const isMockListing = !realListings.some(real => real.id === listing.id);
          
          return (
            <div key={listing.id} className="relative">
              <ListingCard 
                {...listing} 
                isMockListing={isMockListing}
              />
              
              {isMockListing && (
                <Badge 
                  className="absolute top-2 left-2 z-20 bg-orange-100 text-orange-800 flex items-center gap-1"
                  variant="outline"
                >
                  <AlertCircle size={12} />
                  Ilustrativo
                </Badge>
              )}
            </div>
          );
        })}
      </div>
      
      {showIllustrativeMessage && (
        <div className="text-center text-gray-500 text-sm mt-2">
          Os anúncios mostrados são ilustrativos. Crie seus próprios anúncios para vê-los aqui.
        </div>
      )}
    </>
  );
};

export default RecentListingsGrid;
