
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import ListingCard from "@/components/listings/ListingCard";
import LoadingSpinner from "@/components/ui/loading-spinner";
import EmptyListingsState from "./EmptyListingsState";
import { fetchListings } from "@/services/listings/listingService";
import { useToast } from "@/components/ui/use-toast";

interface CategoryListingsProps {
  categoryId: string | undefined;
  searchTerm?: string;
}

const CategoryListings = ({ categoryId, searchTerm }: CategoryListingsProps) => {
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  useEffect(() => {
    const loadListings = async () => {
      setIsLoading(true);
      try {
        // Incluímos o termo de busca se existir
        const searchParams: any = { 
          status: "active" 
        };
        
        if (categoryId) {
          searchParams.category = categoryId;
        }
        
        if (searchTerm) {
          searchParams.search = searchTerm;
        }
        
        console.log("Buscando com parâmetros:", searchParams);
        
        const data = await fetchListings(searchParams);
        console.log(`Encontrados ${data.length} resultados`);
        
        setListings(data || []);
        
        if (searchTerm && data.length === 0) {
          toast({
            title: "Nenhum resultado",
            description: `Não encontramos resultados para "${searchTerm}"`,
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Erro ao carregar anúncios:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao carregar os anúncios",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadListings();
  }, [categoryId, searchTerm, toast]);

  if (isLoading) {
    return <LoadingSpinner message="Carregando anúncios..." />;
  }

  if (listings.length === 0) {
    return <EmptyListingsState searchTerm={searchTerm} />;
  }

  return (
    <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
      {listings.map((listing) => {
        const imageUrl = 
          listing.ad_images && 
          listing.ad_images.length > 0 ? 
          listing.ad_images[0].image_url : 
          '/placeholder.svg';
          
        // Obtém informações do usuário (vendedor)  
        const location = listing.users 
          ? `${listing.users.block || ''} ${listing.users.apartment || ''}` 
          : '';
            
        return (
          <ListingCard
            key={listing.id}
            id={listing.id}
            title={listing.title}
            price={listing.price}
            imageUrl={imageUrl}
            category={listing.category}
            type={listing.type}
            location={location.trim()}
            status="disponível"
          />
        );
      })}
    </div>
  );
};

export default CategoryListings;
