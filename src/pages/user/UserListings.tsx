
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
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
        
        console.log("Listings fetched:", listings);
        setUserListings(listings || []);
        
        // Fetch images for each listing
        if (listings && listings.length > 0) {
          console.log("Fetching images for listings:", listings.map(l => l.id));
          
          const newImageMap: Record<string, string> = {};
          
          for (const listing of listings) {
            try {
              console.log(`Fetching primary image for listing ${listing.id}`);
              
              // Query for images for this listing
              const { data: imageData, error: imgError } = await supabase
                .from('ad_images')
                .select('*')
                .eq('ad_id', listing.id)
                .order('position');
              
              if (imgError) {
                console.error(`Error fetching image for listing ${listing.id}:`, imgError);
                newImageMap[listing.id] = '/placeholder.svg';
                continue;
              }
              
              console.log(`Found ${imageData?.length || 0} images for listing ${listing.id}:`, imageData);
              
              if (imageData && imageData.length > 0) {
                console.log(`Using first image for listing ${listing.id}:`, imageData[0].image_url);
                newImageMap[listing.id] = imageData[0].image_url;
              } else {
                console.log(`No images found for listing ${listing.id}, using placeholder`);
                newImageMap[listing.id] = '/placeholder.svg';
              }
            } catch (error) {
              console.error("Error processing image for listing:", listing.id, error);
              newImageMap[listing.id] = '/placeholder.svg';
            }
          }
          
          console.log("Final image map:", newImageMap);
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
            {userListings.map((listing) => (
              <div key={listing.id} className="relative">
                <ListingCard
                  id={listing.id}
                  title={listing.title}
                  price={listing.price}
                  imageUrl={listingImages[listing.id] || '/placeholder.svg'}
                  category={listing.category}
                  type={listing.type as "produto" | "serviço"}
                  location={userLocation}
                  status={translateStatus(listing.status)}
                />
                <Button
                  size="sm"
                  className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white text-gray-800"
                  asChild
                >
                  <Link to={`/editar-anuncio/${listing.id}`}>
                    <Edit size={16} className="mr-1" />
                    Editar
                  </Link>
                </Button>
              </div>
            ))}
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
