
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ListingCard from "@/components/listings/ListingCard";
import { Listing } from "@/types/listing";
import { Condominium, City, State } from "@/types/location";
import { supabase } from "@/integrations/supabase/client";

const MyCondominiumListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [condominium, setCondominium] = useState<Condominium | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchCondominiumAndListings = async () => {
      if (!user || !user.user_metadata?.condominiumId) {
        setIsLoading(false);
        return;
      }
      
      const condominiumId = user.user_metadata.condominiumId;
      
      try {
        // Fetch condominium details
        const { data: condominiumData, error: condoError } = await supabase
          .from('condominiums')
          .select(`
            *,
            cities (
              id,
              name,
              state_id,
              states (
                id,
                name,
                uf
              )
            )
          `)
          .eq('id', condominiumId)
          .single();
          
        if (condoError) throw condoError;
        
        // Properly cast the data to match the Condominium type
        if (condominiumData) {
          const typedCondominium: Condominium = {
            id: condominiumData.id,
            name: condominiumData.name,
            city_id: condominiumData.city_id,
            address: condominiumData.address,
            approved: condominiumData.approved,
            // Remove the created_at property since it's not in the Condominium type
            cities: condominiumData.cities ? {
              id: condominiumData.cities.id,
              name: condominiumData.cities.name,
              state_id: condominiumData.cities.state_id,
              states: condominiumData.cities.states
            } as City & { states?: State } : undefined
          };
          
          setCondominium(typedCondominium);
        }
        
        // Fetch listings from this condominium
        const { data: listingsData, error } = await supabase
          .from('ads')
          .select('*')
          .eq('condominium_id', condominiumId)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(8);
          
        if (error) throw error;
        
        if (listingsData) {
          setListings(listingsData as Listing[]);
          
          // Fetch images for listings
          const imageMap: Record<string, string> = {};
          
          for (const listing of listingsData) {
            const { data: imageData } = await supabase
              .from('ad_images')
              .select('image_url')
              .eq('ad_id', listing.id)
              .order('position')
              .limit(1);
              
            if (imageData && imageData.length > 0) {
              imageMap[listing.id] = imageData[0].image_url;
            } else {
              imageMap[listing.id] = '/placeholder.svg';
            }
          }
          
          setImageUrls(imageMap);
        }
      } catch (error) {
        console.error('Error fetching condominium listings:', error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os anúncios do seu condomínio."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCondominiumAndListings();
  }, [user, toast]);
  
  // If user is not logged in or has no condominium
  if (!user?.user_metadata?.condominiumId && !isLoading) {
    return null;
  }
  
  // If there are no listings in user's condominium
  if (listings.length === 0 && !isLoading) {
    return null;
  }
  
  return (
    <section className="py-12 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Anúncios do seu Condomínio</h2>
            </div>
            {condominium && (
              <p className="text-gray-600">
                {condominium.name}
                {condominium.cities && (
                  <span className="ml-1 text-gray-500">
                    ({condominium.cities.name} - {condominium.cities.states?.uf})
                  </span>
                )}
              </p>
            )}
          </div>
          
          <Link to={`/explorar?condominiumId=${user?.user_metadata?.condominiumId}`}>
            <Button variant="ghost" className="flex items-center gap-1">
              <span>Ver Todos</span>
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[300px]">
                <Skeleton className="h-full w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                price={listing.price}
                imageUrl={imageUrls[listing.id] || '/placeholder.svg'}
                category={listing.category}
                type={listing.type}
                location={user?.user_metadata?.block 
                  ? `Bloco ${user.user_metadata.block}` 
                  : ""}
                condominiumName={condominium?.name}
                isUserCondominium={true}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyCondominiumListings;
