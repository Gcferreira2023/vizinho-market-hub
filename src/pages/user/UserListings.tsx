import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ListingCard from "@/components/listings/ListingCard";
import SimpleStats from "@/components/listings/stats/SimpleStats";
import { Loader2, Edit, BarChart2, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { Badge } from "@/components/ui/badge";

// Define an interface for the listing with view_count as an optional property
interface Listing {
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

// Define the raw data type from Supabase to handle the type casting
interface RawListing {
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
  view_count?: number; // This might or might not exist in the raw data
}

const UserListings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listingImages, setListingImages] = useState<Record<string, string>>({});
  const [listingStats, setListingStats] = useState<Record<string, { views: number, days: number, contacts: number }>>({});

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
        
        if (listings) {
          // Transform the raw listings to include view_count property safely
          const listingsWithViewCount: Listing[] = listings.map((listing: RawListing) => ({
            ...listing,
            view_count: listing.view_count || 0
          }));
          
          setUserListings(listingsWithViewCount);
          
          // Calculate stats for each listing
          const stats: Record<string, { views: number, days: number, contacts: number }> = {};
          
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
  
  // Calcular estatísticas globais
  const totalViews = userListings.reduce((sum, listing) => sum + (listing.view_count || 0), 0);
  const totalListings = userListings.length;
  
  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "'Criado em' dd 'de' MMMM", { locale: ptBR });
  };
    
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Meus Anúncios</h1>
            <p className="text-gray-600">Gerencie seus produtos e serviços</p>
          </div>
          <Button asChild>
            <Link to="/criar-anuncio">Criar Novo Anúncio</Link>
          </Button>
        </div>
        
        {isLoading ? (
          <>
            <div className="bg-muted/20 p-4 rounded-lg mb-6">
              <div className="animate-pulse h-16 bg-muted rounded"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </>
        ) : userListings.length > 0 ? (
          <>
            <div className="bg-primary/5 border border-primary/10 p-4 rounded-lg mb-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="text-center md:text-left">
                    <span className="text-sm text-gray-500">Total de anúncios</span>
                    <h3 className="text-2xl font-bold">{totalListings}</h3>
                  </div>
                  <div className="text-center md:text-left">
                    <span className="text-sm text-gray-500">Total de visualizações</span>
                    <h3 className="text-2xl font-bold">{totalViews}</h3>
                  </div>
                </div>
                <div className="flex items-center justify-center md:justify-end">
                  <Button variant="outline" size="sm" className="gap-2">
                    <BarChart2 size={16} />
                    <span>Estatísticas detalhadas</span>
                  </Button>
                </div>
              </div>
            </div>

            <Tabs defaultValue="grid" className="mb-6">
              <TabsList className="w-full sm:w-auto mb-4">
                <TabsTrigger value="grid" className="flex-1">Visualização em Grid</TabsTrigger>
                <TabsTrigger value="list" className="flex-1">Visualização em Lista</TabsTrigger>
              </TabsList>
              
              <TabsContent value="grid">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {userListings.map((listing) => (
                    <div key={listing.id} className="relative group">
                      <ListingCard
                        id={listing.id}
                        title={listing.title}
                        price={listing.price}
                        imageUrl={listingImages[listing.id] || '/placeholder.svg'}
                        category={listing.category}
                        type={listing.type as "produto" | "serviço"}
                        location={userLocation}
                        status={translateStatus(listing.status)}
                        linkTo={`/anuncio/${listing.id}`}
                        viewCount={listing.view_count}
                        lazyLoad={true}
                      />
                      <Link 
                        to={`/editar-anuncio/${listing.id}`}
                        className="absolute top-2 right-2 z-20 bg-white/90 hover:bg-white text-gray-800 py-1 px-3 rounded-md flex items-center shadow-sm"
                      >
                        <Edit size={16} className="mr-1" />
                        <span>Editar</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="list">
                <div className="space-y-4">
                  {userListings.map((listing) => (
                    <div key={listing.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/4">
                          <img 
                            src={listingImages[listing.id] || '/placeholder.svg'} 
                            alt={listing.title}
                            className="w-full h-48 md:h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        
                        <div className="p-4 flex-1">
                          <div className="mb-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold">{listing.title}</h3>
                              <Link 
                                to={`/editar-anuncio/${listing.id}`}
                                className="bg-primary/10 hover:bg-primary/20 text-primary py-1 px-3 rounded-md flex items-center text-sm"
                              >
                                <Edit size={14} className="mr-1" />
                                <span>Editar</span>
                              </Link>
                            </div>
                            <p className="text-sm text-gray-500">{formatDate(listing.created_at)}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="outline">
                              {listing.category}
                            </Badge>
                            <Badge variant={listing.type === "produto" ? "default" : "secondary"}>
                              {listing.type}
                            </Badge>
                            <Badge variant={
                              listing.status === "active" ? "outline" : 
                              listing.status === "reserved" ? "secondary" : 
                              "destructive"
                            }>
                              {translateStatus(listing.status)}
                            </Badge>
                          </div>
                          
                          <div className="flex justify-between items-end">
                            <span className="font-bold text-lg text-primary">
                              {typeof listing.price === "number" ? `R$ ${Number(listing.price).toFixed(2)}` : listing.price}
                            </span>
                            
                            <div className="flex gap-4 items-center text-sm">
                              <div className="flex items-center gap-1 text-gray-600">
                                <Eye size={16} />
                                <span>{listing.view_count || 0} visualizações</span>
                              </div>
                              
                              <Link 
                                to={`/anuncio/${listing.id}`}
                                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                              >
                                Ver Anúncio
                              </Link>
                            </div>
                          </div>
                          
                          {/* Barra de progresso simples - simulando conversão */}
                          <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ width: `${Math.min(100, listing.view_count ? (listing.view_count / 20) * 100 : 5)}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between mt-1 text-xs text-gray-500">
                              <span>Desempenho do anúncio</span>
                              <span>{Math.min(100, listing.view_count ? Math.round((listing.view_count / 20) * 100) : 5)}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-medium mb-2">Você ainda não possui anúncios</h3>
              <p className="text-gray-600 mb-6">Crie seu primeiro anúncio e comece a vender para seu condomínio!</p>
              <Button asChild size="lg">
                <Link to="/criar-anuncio">Criar meu primeiro anúncio</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserListings;
