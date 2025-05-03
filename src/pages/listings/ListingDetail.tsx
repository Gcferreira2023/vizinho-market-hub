import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Clock } from "lucide-react";
import ListingCard from "@/components/listings/ListingCard";
import ListingImageGallery from "@/components/listings/ListingImageGallery";
import SellerInfo from "@/components/listings/SellerInfo";
import StatusSelector from "@/components/listings/StatusSelector";
import { ListingStatus } from "@/components/listings/StatusBadge";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [listing, setListing] = useState<any>(null);
  const [listingImages, setListingImages] = useState<string[]>([]);
  const [listingStatus, setListingStatus] = useState<ListingStatus>("disponível");
  const [isLoading, setIsLoading] = useState(true);
  const [similarListings, setSimilarListings] = useState<any[]>([]);

  useEffect(() => {
    const fetchListingDetails = async () => {
      if (!id) return;
      
      try {
        console.log("Fetching listing details for ID:", id);
        setIsLoading(true);
        
        // Fetch the listing data
        const { data: listingData, error: listingError } = await supabase
          .from('ads')
          .select('*')
          .eq('id', id)
          .single();
          
        if (listingError) {
          throw listingError;
        }
        
        console.log("Listing data:", listingData);
        
        if (listingData) {
          setListing(listingData);
          
          // Map status
          const status = translateStatus(listingData.status);
          setListingStatus(status);
          
          // Fetch images for the listing
          const { data: imageData, error: imageError } = await supabase
            .from('ad_images')
            .select('*')
            .eq('ad_id', id)
            .order('position');
            
          if (imageError) {
            console.error("Error fetching images:", imageError);
          } else {
            console.log("Image data:", imageData);
            const images = imageData?.map(img => img.image_url) || [];
            setListingImages(images.length > 0 ? images : ['/placeholder.svg']);
          }
          
          // Fetch seller information
          // This would typically come from a join or separate query
          
          // Fetch similar listings (mock for now)
          // In real app, you would fetch based on category, etc.
          const { data: similarData, error: similarError } = await supabase
            .from('ads')
            .select('*')
            .neq('id', id)
            .eq('category', listingData.category)
            .limit(3);
            
          if (similarError) {
            console.error("Error fetching similar listings:", similarError);
          } else {
            setSimilarListings(similarData || []);
          }
        }
      } catch (error) {
        console.error("Error fetching listing details:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os detalhes deste anúncio",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchListingDetails();
  }, [id, toast]);
  
  // If no real data yet, use mock data
  const mockListing = {
    id: id || "1",
    title: "Bolo de Chocolate Caseiro",
    price: 35.9,
    description:
      "Delicioso bolo de chocolate caseiro com cobertura de brigadeiro. Feito com ingredientes selecionados e muito carinho. Ideal para festas, aniversários ou para matar aquela vontade de comer algo doce. Tamanho médio, serve aproximadamente 10 pessoas.",
    images: listingImages.length > 0 ? listingImages : [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187",
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
    ],
    category: "Alimentos",
    type: "produto" as const,
    rating: 4.8,
    location: "Bloco A, 101",
    status: listingStatus,
    seller: {
      id: "s1",
      name: "Maria Silva",
      apartment: "101",
      block: "A",
      rating: 4.9,
      listings: 12,
      phone: "5511999999999",
    },
    availability: "Segunda a Sexta, das 09h às 18h",
    delivery: true,
    deliveryFee: 5.0,
    paymentMethods: ["Pix", "Dinheiro", "Cartão de Crédito"],
  };
  
  // Use real data if available, otherwise fall back to mock data
  const displayListing = listing || mockListing;
  
  // Map status from English to Portuguese
  function translateStatus(status: string): ListingStatus {
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
  }
  
  const handleStatusChange = (newStatus: ListingStatus) => {
    setListingStatus(newStatus);
    toast({
      title: "Status atualizado",
      description: `O anúncio agora está ${newStatus}.`,
    });
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container flex justify-center items-center py-16">
          <div className="animate-spin mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
          </div>
          Carregando anúncio...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link
            to="/explorar"
            className="text-primary hover:underline flex items-center"
          >
            ← Voltar para anúncios
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Esquerda - Imagens e Detalhes */}
          <div className="lg:col-span-2">
            {/* Galeria de imagens */}
            <ListingImageGallery 
              images={displayListing.images} 
              title={displayListing.title} 
              status={listingStatus}
            />

            {/* Detalhes do anúncio */}
            <Card className="p-6 mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      displayListing.type === "produto" ? "default" : "secondary"
                    }
                  >
                    {displayListing.type}
                  </Badge>
                  <span className="text-sm text-gray-500">{displayListing.category}</span>
                </div>
                <StatusSelector 
                  adId={displayListing.id}
                  currentStatus={listingStatus}
                  onStatusChange={handleStatusChange}
                  userId={user?.id}
                  ownerId={listing?.user_id || displayListing.seller.id}
                />
              </div>
              <h1 className="text-2xl font-bold mb-2">{displayListing.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <Star
                  size={18}
                  className="text-yellow-400 fill-yellow-400"
                />
                <span className="font-semibold">{displayListing.rating}</span>
              </div>

              <div className="mb-6">
                <span className="text-2xl font-bold text-primary">
                  {typeof displayListing.price === "number"
                    ? `R$ ${displayListing.price.toFixed(2)}`
                    : displayListing.price}
                </span>
              </div>

              <Tabs defaultValue="descricao" className="mb-6">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="descricao">Descrição</TabsTrigger>
                  <TabsTrigger value="disponibilidade">Disponibilidade</TabsTrigger>
                  <TabsTrigger value="pagamento">Pagamento</TabsTrigger>
                </TabsList>
                <TabsContent value="descricao" className="text-gray-700">
                  <p>{displayListing.description}</p>
                </TabsContent>
                <TabsContent value="disponibilidade" className="space-y-3">
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      <Clock size={18} className="text-gray-500" /> 
                      Horário de disponibilidade:
                    </h3>
                    <p className="text-gray-700 ml-6">{displayListing.availability}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Entrega:</h3>
                    <p className="text-gray-700">
                      {displayListing.delivery
                        ? `Sim (Taxa de R$ ${displayListing.deliveryFee.toFixed(2)})`
                        : "Não disponível"}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Localização:</h3>
                    <p className="text-gray-700">{displayListing.location}</p>
                  </div>
                </TabsContent>
                <TabsContent value="pagamento">
                  <h3 className="font-medium mb-2">Formas de pagamento aceitas:</h3>
                  <div className="flex flex-wrap gap-2">
                    {displayListing.paymentMethods.map((method, index) => (
                      <Badge key={index} variant="outline">{method}</Badge>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Coluna Direita - Informações do vendedor e ações */}
          <div className="space-y-6">
            {/* Informações do vendedor */}
            <SellerInfo 
              seller={displayListing.seller} 
              adId={id}
            />

            {/* Segurança */}
            <Card className="p-4">
              <h3 className="font-medium mb-2 text-sm">Compra segura</h3>
              <p className="text-xs text-gray-500">
                Converse com o vendedor antes de realizar qualquer pagamento e faça negociações seguras, preferencialmente em locais públicos dentro do condomínio.
              </p>
            </Card>
          </div>
        </div>

        {/* Anúncios relacionados */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Anúncios Similares</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {mockSimilarListings.map((listing) => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ListingDetail;
