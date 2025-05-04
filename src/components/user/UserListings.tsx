
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/ui/loading-spinner";

const UserListings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userListings, setUserListings] = useState<any[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  
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
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {userListings.map((listing) => (
        <Card key={listing.id} className="overflow-hidden">
          <div className="p-4">
            <h3 className="font-medium mb-2">{listing.title}</h3>
            <p className="text-primary font-bold">
              R$ {Number(listing.price).toFixed(2)}
            </p>
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
  );
};

export default UserListings;
