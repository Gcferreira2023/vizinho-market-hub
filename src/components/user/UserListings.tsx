
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ListingMetrics from "./listings/ListingMetrics";
import { Eye, ChartBar } from "lucide-react";

const UserListings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userListings, setUserListings] = useState<any[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [listingImages, setListingImages] = useState<Record<string, string>>({});
  
  useEffect(() => {
    const fetchUserListings = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('ads')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setUserListings(data || []);
        
        // Buscar imagens para cada anúncio
        if (data && data.length > 0) {
          const imageMap: Record<string, string> = {};
          
          for (const listing of data) {
            const { data: imageData } = await supabase
              .from('ad_images')
              .select('image_url')
              .eq('ad_id', listing.id)
              .order('position')
              .limit(1);
              
            imageMap[listing.id] = imageData && imageData.length > 0 
              ? imageData[0].image_url 
              : '/placeholder.svg';
          }
          
          setListingImages(imageMap);
        }
      } catch (error: any) {
        console.error('Erro ao buscar anúncios:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar seus anúncios",
          variant: "destructive"
        });
      } finally {
        setIsLoadingListings(false);
      }
    };
    
    fetchUserListings();
  }, [user, toast]);
  
  if (isLoadingListings) {
    return (
      <div className="text-center py-8">
        <LoadingSpinner message="Carregando seus anúncios..." />
      </div>
    );
  }
  
  if (userListings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="mb-4">Você ainda não possui nenhum anúncio</p>
        <Button asChild>
          <Link to="/criar-anuncio">Criar meu primeiro anúncio</Link>
        </Button>
      </div>
    );
  }
  
  // Calcular estatísticas
  const totalViews = userListings.reduce((sum, listing) => sum + (listing.viewCount || 0), 0);
  
  return (
    <div>
      {/* Resumo de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-primary/5 rounded-lg p-4 flex items-center">
          <div className="rounded-full bg-primary/10 p-3 mr-4">
            <ChartBar className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total de anúncios</p>
            <p className="text-2xl font-bold">{userListings.length}</p>
          </div>
        </div>
        
        <div className="bg-primary/5 rounded-lg p-4 flex items-center">
          <div className="rounded-full bg-primary/10 p-3 mr-4">
            <Eye className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total de visualizações</p>
            <p className="text-2xl font-bold">{totalViews}</p>
          </div>
        </div>
        
        <div className="bg-primary/5 rounded-lg p-4 flex items-center">
          <div className="rounded-full bg-primary/10 p-3 mr-4">
            <Eye className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Média por anúncio</p>
            <p className="text-2xl font-bold">
              {userListings.length > 0 ? Math.round(totalViews / userListings.length) : 0}
            </p>
          </div>
        </div>
      </div>
    
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {userListings.map((listing) => (
          <Card key={listing.id} className="overflow-hidden">
            <div className="p-4">
              <h3 className="font-medium mb-2">{listing.title}</h3>
              <p className="text-primary font-bold">
                R$ {Number(listing.price).toFixed(2)}
              </p>
              
              <div className="mt-3 border-t pt-3">
                <ListingMetrics 
                  viewCount={listing.viewCount || 0} 
                  createdAt={listing.created_at}
                  condensed={true}
                />
              </div>
              
              <div className="mt-4 flex justify-between">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/anuncio/${listing.id}`}>Ver</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to={`/editar-anuncio/${listing.id}`}>Editar</Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserListings;
