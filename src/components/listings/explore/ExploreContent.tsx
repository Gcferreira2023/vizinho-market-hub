
import { FC } from "react";
import FilterSidebar from "@/components/listings/explore/FilterSidebar";
import ListingsGrid from "@/components/listings/explore/ListingsGrid";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useAuth } from "@/contexts/AuthContext";
import { ListingStatus, mapStatusFromDB } from "@/components/listings/StatusBadge";
import { Listing } from "@/types/listing";

interface ExploreContentProps {
  listings: any[];
  isLoading: boolean;
  searchTerm: string;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
  selectedStatus: ListingStatus | null;
  setSelectedStatus: (status: ListingStatus | null) => void;
  showSoldItems: boolean;
  setShowSoldItems: (show: boolean) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  resetFilters: () => void;
}

const ExploreContent: FC<ExploreContentProps> = ({
  listings,
  isLoading,
  searchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus,
  showSoldItems,
  setShowSoldItems,
  priceRange,
  setPriceRange,
  resetFilters
}) => {
  const { user } = useAuth();
  
  // Preparar os dados dos anúncios para o componente ListingCard
  const formattedListings: Listing[] = listings.map(listing => {
    // Preparar os dados do anúncio para o componente ListingCard
    const imageUrl = 
      listing.ad_images && 
      listing.ad_images.length > 0 ? 
      listing.ad_images[0].image_url : 
      '/placeholder.svg';
    
    // Obtém informações do usuário (vendedor)  
    const location = listing.users 
      ? `${listing.users.block || ''} ${listing.users.apartment || ''}` 
      : '';
    
    // Verifica se o anúncio é do mesmo condomínio do usuário logado
    const isUserCondominium = user?.user_metadata?.condominiumId === listing.condominium_id;
    
    // Obtém o nome do condomínio, se disponível
    const condominiumName = listing.condominiums?.name || "Desconhecido";
      
    return {
      id: listing.id,
      title: listing.title,
      price: listing.price,
      imageUrl: imageUrl,
      category: listing.category,
      type: listing.type as "produto" | "serviço",
      location: location.trim(),
      status: mapStatusFromDB(listing.status),
      condominiumName: condominiumName,
      isUserCondominium: isUserCondominium,
      viewCount: Math.floor(Math.random() * 30) + 2 // Simulated view count for now
    };
  });

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <FilterSidebar 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        showSoldItems={showSoldItems}
        setShowSoldItems={setShowSoldItems}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        resetFilters={resetFilters}
      />

      <div className="flex-1">
        {isLoading ? (
          <LoadingSpinner message="Carregando anúncios..." />
        ) : (
          <ListingsGrid 
            listings={formattedListings}
            searchTerm={searchTerm} 
          />
        )}
      </div>
    </div>
  );
};

export default ExploreContent;
