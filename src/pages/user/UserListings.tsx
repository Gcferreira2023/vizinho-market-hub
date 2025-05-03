
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ListingCard from "@/components/listings/ListingCard";
import { Loader2, Edit } from "lucide-react";

const UserListings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userListings, setUserListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listingImages, setListingImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchUserListings = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch user's listings
        const { data: listings, error } = await supabase
          .from('ads')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setUserListings(listings || []);
        
        // Fetch primary images for each listing
        if (listings && listings.length > 0) {
          console.log("Fetching images for listings:", listings.map(l => l.id));
          
          for (const listing of listings) {
            try {
              // Query for the first image (position 0) for this listing
              const { data, error: imgError } = await supabase
                .from('ad_images')
                .select('image_url')
                .eq('ad_id', listing.id)
                .eq('position', 0)
                .maybeSingle();
              
              if (imgError) {
                console.error(`Error fetching image for listing ${listing.id}:`, imgError);
                continue;
              }
              
              if (data && data.image_url) {
                console.log(`Found image for listing ${listing.id}:`, data.image_url);
                setListingImages(prev => ({...prev, [listing.id]: data.image_url}));
              } else {
                console.log(`No image found for listing ${listing.id}, using placeholder`);
                setListingImages(prev => ({...prev, [listing.id]: '/placeholder.svg'}));
              }
            } catch (error) {
              console.error("Error processing image for listing:", listing.id, error);
              setListingImages(prev => ({...prev, [listing.id]: '/placeholder.svg'}));
            }
          }
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

  // Map status from English to Portuguese
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

  // Format user data for location display
  const userLocation = user?.user_metadata 
    ? `Bloco ${user.user_metadata.block || '-'}, Apt ${user.user_metadata.apartment || '-'}`
    : "Localização não informada";
    
  // Custom ListingCard renderer that includes edit button
  const renderListingCard = (listing: any) => {
    return (
      <div key={listing.id} className="relative">
        <ListingCard
          id={listing.id}
          title={listing.title}
          price={listing.price}
          imageUrl={listingImages[listing.id] || '/placeholder.svg'}
          category={listing.category}
          type={listing.type}
          location={userLocation}
          status={translateStatus(listing.status)}
        />
        <Button
          size="sm"
          className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-white text-gray-800"
          asChild
        >
          <Link to={`/editar-anuncio/${listing.id}`}>
            <Edit size={16} className="mr-1" />
            Editar
          </Link>
        </Button>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Meus Anúncios</h1>
          <Button asChild>
            <Link to="/criar-anuncio">Criar Novo Anúncio</Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando seus anúncios...</span>
          </div>
        ) : userListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {userListings.map(renderListingCard)}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg mb-4">Você ainda não possui nenhum anúncio</p>
            <Button asChild>
              <Link to="/criar-anuncio">Criar meu primeiro anúncio</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserListings;
