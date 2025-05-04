
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, PenSquare, LogOut, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useFavorites } from "@/hooks/useFavorites";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ListingCard from "@/components/listings/ListingCard";
import { ListingStatus } from "@/components/listings/StatusBadge";
import { Condominium } from "@/types/location";
import { Badge } from "@/components/ui/badge";

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [userListings, setUserListings] = useState<any[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const { favorites, isLoading: isLoadingFavorites } = useFavorites();
  const [condominium, setCondominium] = useState<Condominium | null>(null);
  const [isLoadingCondominium, setIsLoadingCondominium] = useState(false);

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
    
    // Buscar informações do condomínio
    const fetchCondominium = async () => {
      if (!user || !user.user_metadata?.condominiumId) return;
      
      try {
        setIsLoadingCondominium(true);
        const condominiumId = user.user_metadata.condominiumId;
        
        const { data, error } = await supabase
          .from('condominiums')
          .select(`
            *,
            cities (
              name,
              states (name, uf)
            )
          `)
          .eq('id', condominiumId)
          .single();
          
        if (error) {
          console.error('Erro ao buscar condomínio:', error);
          return;
        }
        
        setCondominium(data);
      } catch (error) {
        console.error('Erro ao buscar condomínio:', error);
      } finally {
        setIsLoadingCondominium(false);
      }
    };
    
    fetchUserListings();
    fetchCondominium();
  }, [user, toast]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você saiu da sua conta"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível fazer logout",
        variant: "destructive"
      });
    }
  };

  // Dados do usuário a partir dos metadados do Supabase Auth
  const userData = user?.user_metadata || {};

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Coluna de perfil */}
          <div className="w-full md:w-1/3">
            <Card className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <User size={40} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold">{userData.full_name || "Usuário"}</h2>
                <p className="text-gray-500">
                  {`Bloco ${userData.block || '-'}, Apt ${userData.apartment || '-'}`}
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{user?.email}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p>{userData.phone || "Não informado"}</p>
                </div>
                
                {/* Informações do condomínio */}
                <div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    <p className="text-sm text-gray-500">Condomínio</p>
                  </div>
                  
                  {isLoadingCondominium ? (
                    <div className="flex justify-center py-2">
                      <LoadingSpinner size="sm" />
                    </div>
                  ) : condominium ? (
                    <div className="mt-1">
                      <Badge variant="outline" className="text-xs">
                        {condominium.name}
                      </Badge>
                      {condominium.cities && (
                        <p className="mt-1 text-xs text-gray-500">
                          {condominium.cities.name} - {condominium.cities.states?.uf}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="italic text-sm text-gray-400">Não configurado</p>
                  )}
                </div>
                
                <div className="pt-4 flex flex-col space-y-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/editar-perfil" className="flex items-center">
                      <PenSquare className="mr-2" size={16} />
                      Editar Perfil
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2" size={16} />
                    Sair
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Coluna de conteúdo */}
          <div className="w-full md:w-2/3">
            <Tabs defaultValue="meus-anuncios">
              <TabsList className="mb-6">
                <TabsTrigger value="meus-anuncios">Meus Anúncios</TabsTrigger>
                <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="meus-anuncios">
                {isLoadingListings ? (
                  <div className="text-center py-8">
                    <LoadingSpinner message="Carregando seus anúncios..." />
                  </div>
                ) : userListings.length > 0 ? (
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
                ) : (
                  <div className="text-center py-8">
                    <p className="mb-4">Você ainda não possui nenhum anúncio</p>
                    <Button asChild>
                      <Link to="/criar-anuncio">Criar meu primeiro anúncio</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="favoritos">
                {isLoadingFavorites ? (
                  <div className="text-center py-8">
                    <LoadingSpinner message="Carregando seus favoritos..." />
                  </div>
                ) : favorites.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {favorites.slice(0, 4).map((fav) => {
                        if (!fav.ad) return null;
                        
                        const imageUrl = fav.ad.ad_images && fav.ad.ad_images.length > 0
                          ? fav.ad.ad_images[0].image_url
                          : '/placeholder.svg';
                          
                        const status: ListingStatus = 
                          fav.ad.status === "active" ? "disponível" :
                          fav.ad.status === "reserved" ? "reservado" : "vendido";
                          
                        return (
                          <Card key={fav.id} className="overflow-hidden">
                            <div className="p-4">
                              <h3 className="font-medium mb-2">{fav.ad.title}</h3>
                              <p className="text-primary font-bold">
                                R$ {Number(fav.ad.price).toFixed(2)}
                              </p>
                              <div className="mt-4">
                                <Button asChild variant="outline" size="sm" className="w-full">
                                  <Link to={`/anuncio/${fav.ad.id}`}>Ver Anúncio</Link>
                                </Button>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                    {favorites.length > 4 && (
                      <div className="text-center mt-6">
                        <Button asChild>
                          <Link to="/favoritos">Ver todos os {favorites.length} favoritos</Link>
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="mb-4">Você ainda não possui anúncios favoritos</p>
                    <Button asChild>
                      <Link to="/explorar">Explorar Anúncios</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
