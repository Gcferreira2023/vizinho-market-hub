
import ListingCard from "../../listings/ListingCard";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { ListingStatus } from "../../listings/StatusBadge";
import { useMemo, useEffect } from "react";

interface FeaturedListingsGridProps {
  isLoading: boolean;
  filterType?: string;
  realListings: any[];
  mockListings: any[];
}

const FeaturedListingsGrid = ({ 
  isLoading, 
  filterType,
  realListings,
  mockListings
}: FeaturedListingsGridProps) => {

  // Combinar anúncios reais com mockups para cada categoria, sem repetir categorias
  const listings = useMemo(() => {
    // Primeiro filtrar por tipo se necessário
    const filteredReal = filterType 
      ? realListings.filter(item => item.type === filterType)
      : realListings;
      
    console.log(`FeaturedListingsGrid: ${filteredReal.length} real listings after filtering by ${filterType || 'all types'}`);
      
    // Se tiver 4 ou mais anúncios reais da categoria, mostrar apenas os reais
    if (filteredReal.length >= 4) {
      return filteredReal.slice(0, 4);
    }
    
    // Caso contrário, complementar com mockups
    const usedCategories = new Set(filteredReal.map(item => item.category));
    
    // Filtrar mockups por tipo (se necessário) e por categorias não usadas
    let filteredMockups = filterType
      ? mockListings.filter(mock => mock.type === filterType)
      : mockListings;
      
    // Filtrar para não repetir categorias já existentes nos reais
    filteredMockups = filteredMockups.filter(mock => !usedCategories.has(mock.category));
    
    // Combinar e retornar até 4 itens
    return [...filteredReal, ...filteredMockups].slice(0, 4);
  }, [filterType, realListings, mockListings]);

  // Debug logs
  useEffect(() => {
    console.log("FeaturedListingsGrid - listings data:", listings);
    listings.forEach(listing => {
      console.log(`Listing ID: ${listing.id}, Image URL: ${listing.imageUrl}, Type: ${typeof listing.imageUrl}`);
    });
  }, [listings]);

  if (isLoading) {
    return <LoadingGrid />;
  }
  
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings.map((listing) => {
          // Verificar se é um anúncio mockup
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
      
      {listings.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">
            Não há anúncios {filterType ? `do tipo ${filterType}` : ""} disponíveis no momento.
          </p>
        </div>
      )}
      
      {realListings.length === 0 && listings.length > 0 && (
        <div className="text-center text-gray-500 text-sm mt-2">
          Os anúncios mostrados são ilustrativos. Crie seus próprios anúncios para vê-los aqui.
        </div>
      )}
    </>
  );
};

// Loading state component
const LoadingGrid = () => (
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

export default FeaturedListingsGrid;
