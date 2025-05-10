import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import ListingCard from "@/components/listings/ListingCard";
import LoadingSpinner from "@/components/ui/loading-spinner";
import EmptyListingsState from "./EmptyListingsState";
import { fetchListings } from "@/services/listings/listingService";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { categories, categoryMappings } from "@/constants/listings";

interface CategoryListingsProps {
  categoryId: string | undefined;
  searchTerm?: string;
}

const CategoryListings = ({ categoryId, searchTerm }: CategoryListingsProps) => {
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [condominiumDetails, setCondominiumDetails] = useState<Record<string, any>>({});
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { user } = useAuth();
  const userCondominiumId = user?.user_metadata?.condominiumId;
  
  useEffect(() => {
    const loadListings = async () => {
      setIsLoading(true);
      try {
        // Include search term if it exists
        const searchParams: any = { 
          status: "active" 
        };
        
        if (categoryId) {
          // Use the category ID directly
          searchParams.category = categoryId;
          console.log(`Filtering by category ID: ${categoryId}`);
        }
        
        if (searchTerm) {
          searchParams.search = searchTerm;
          console.log(`Searching for term: ${searchTerm}`);
        }
        
        console.log("Searching with parameters:", searchParams);
        
        const data = await fetchListings(searchParams);
        console.log(`Found ${data.length} results`);
        
        // Log detailed information about each result
        if (data.length > 0) {
          data.forEach((item: any) => {
            console.log(`Item ID: ${item.id}, Title: ${item.title}, Category: ${item.category}, Type: ${item.type}`);
          });
        }
        
        setListings(data || []);
        
        if (searchTerm && data.length === 0) {
          toast({
            title: "Nenhum resultado",
            description: `Não encontramos resultados para "${searchTerm}"`,
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error loading listings:", error);
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

  useEffect(() => {
    // Fetch condominium info for listings
    const fetchCondominiumData = async () => {
      const details: Record<string, any> = {};
      
      for (const listing of listings) {
        if (listing.condominium_id && !details[listing.condominium_id]) {
          try {
            const { data, error } = await supabase
              .from('condominiums')
              .select(`
                name,
                cities (
                  name,
                  states (
                    name,
                    uf
                  )
                )
              `)
              .eq('id', listing.condominium_id)
              .single();
              
            if (!error && data) {
              details[listing.condominium_id] = data;
            }
          } catch (error) {
            console.error(`Error fetching condominium for listing ${listing.id}:`, error);
          }
        }
      }
      
      setCondominiumDetails(details);
    };
    
    if (listings.length > 0) {
      fetchCondominiumData();
    }
  }, [listings]);

  if (isLoading) {
    return <LoadingSpinner message="Carregando anúncios..." />;
  }

  if (listings.length === 0) {
    return <EmptyListingsState searchTerm={searchTerm} />;
  }

  return (
    <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
      {listings.map((listing) => {
        const condoInfo = condominiumDetails[listing.condominium_id];
        const isUserCondominium = userCondominiumId === listing.condominium_id;
        const condoName = condoInfo?.name || 
                          listing.condominiums?.name || 
                          "Não informado";
            
        // Get first image or use placeholder  
        const imageUrl = listing.ad_images && 
                         listing.ad_images.length > 0 ? 
                         listing.ad_images[0].image_url : 
                         '/placeholder.svg';
          
        // Get user (seller) information  
        const location = listing.users 
          ? `${listing.users.block || ''} ${listing.users.apartment || ''}` 
          : '';
          
        // Map DB category value to UI category ID if needed
        let categoryForDisplay = listing.category;
        if (listing.category && categoryMappings.dbToId[listing.category]) {
          categoryForDisplay = categoryMappings.dbToId[listing.category];
        }
            
        return (
          <ListingCard
            key={listing.id}
            id={listing.id}
            title={listing.title}
            price={listing.price}
            imageUrl={imageUrl}
            category={categoryForDisplay}
            type={listing.type}
            location={location.trim()}
            status="disponível"
            condominiumName={condoName}
            isUserCondominium={isUserCondominium}
            lazyLoad={true}
          />
        );
      })}
    </div>
  );
};

export default CategoryListings;
