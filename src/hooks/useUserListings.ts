
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format, differenceInDays } from "date-fns";

// Interface para os anúncios
export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  type: string;
  availability: string;
  status: string;
  delivery: boolean;
  delivery_fee: number | null;
  payment_methods: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  condominium_id: string | null;
  view_count?: number;
}

// Interface para as estatísticas dos anúncios
export interface ListingStats {
  views: number;
  days: number;
  contacts: number;
}

export const useUserListings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listingImages, setListingImages] = useState<Record<string, string>>({});
  const [listingStats, setListingStats] = useState<Record<string, ListingStats>>({});

  useEffect(() => {
    const fetchUserListings = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Buscar anúncios do usuário
        const { data: listings, error } = await supabase
          .from('ads')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        console.log("Listings fetched:", listings);
        
        if (listings) {
          // Transformar os dados brutos para incluir view_count com segurança
          const listingsWithViewCount: Listing[] = listings.map((listing: any) => ({
            ...listing,
            view_count: listing.view_count || 0
          }));
          
          setUserListings(listingsWithViewCount);
          
          // Calcular estatísticas para cada anúncio
          const stats: Record<string, ListingStats> = {};
          
          listingsWithViewCount.forEach(listing => {
            const createdDate = new Date(listing.created_at);
            const daysSinceCreation = differenceInDays(new Date(), createdDate);
            
            stats[listing.id] = {
              views: listing.view_count || 0,
              days: daysSinceCreation,
              // Simulando contatos baseado em visualizações
              contacts: Math.floor((listing.view_count || 0) * 0.3)
            };
          });
          
          setListingStats(stats);
        }
        
        // Buscar imagens para cada anúncio
        if (listings && listings.length > 0) {
          const newImageMap: Record<string, string> = {};
          
          for (const listing of listings) {
            try {
              // Buscar imagens para este anúncio
              const { data: imageData, error: imgError } = await supabase
                .from('ad_images')
                .select('*')
                .eq('ad_id', listing.id)
                .order('position');
              
              if (imgError) {
                console.error(`Erro ao buscar imagem para o anúncio ${listing.id}:`, imgError);
                newImageMap[listing.id] = '/placeholder.svg';
                continue;
              }
              
              if (imageData && imageData.length > 0) {
                newImageMap[listing.id] = imageData[0].image_url;
              } else {
                newImageMap[listing.id] = '/placeholder.svg';
              }
            } catch (error) {
              console.error("Erro ao processar imagem para o anúncio:", listing.id, error);
              newImageMap[listing.id] = '/placeholder.svg';
            }
          }
          
          setListingImages(newImageMap);
        }
      } catch (error: any) {
        console.error('Erro ao buscar anúncios:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar seus anúncios",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserListings();
  }, [user, toast]);

  // Mapear status de inglês para português
  const translateStatus = (status: string): "disponível" | "reservado" | "vendido" => {
    switch (status) {
      case "active":
        return "disponível";
      case "reserved":
        return "reservado";
      case "sold":
        return "vendido";
      default:
        return "disponível";
    }
  };

  // Formatar localização do usuário
  const userLocation = user?.user_metadata 
    ? `Bloco ${user.user_metadata.block || '-'}, Apt ${user.user_metadata.apartment || '-'}`
    : "Localização não informada";
  
  // Calcular estatísticas globais
  const totalViews = userListings.reduce((sum, listing) => sum + (listing.view_count || 0), 0);
  const totalListings = userListings.length;
  
  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "'Criado em' dd 'de' MMMM", { locale: require('date-fns/locale/pt-BR') });
  };

  return {
    userListings,
    isLoading,
    listingImages,
    listingStats,
    translateStatus,
    userLocation,
    totalViews,
    totalListings,
    formatDate
  };
};
