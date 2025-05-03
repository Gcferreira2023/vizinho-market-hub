
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ListingImageGallery from "@/components/listings/ListingImageGallery";
import SellerInfo from "@/components/listings/SellerInfo";
import { ListingStatus } from "@/components/listings/StatusBadge";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ListingDetailTabs from "@/components/listings/detail/ListingDetailTabs";
import ListingHeader from "@/components/listings/detail/ListingHeader";
import SecurityInfo from "@/components/listings/detail/SecurityInfo";
import SimilarListings from "@/components/listings/similar/SimilarListings";
import FavoriteButton from "@/components/listings/FavoriteButton";

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [listing, setListing] = useState<any>(null);
  const [listingImages, setListingImages] = useState<string[]>([]);
  const [listingStatus, setListingStatus] = useState<ListingStatus>("disponível");
  const [isLoading, setIsLoading] = useState(true);

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
  }, [id]);
  
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
        <LoadingSpinner message="Carregando anúncio..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Explorar", href: "/explorar" },
            { label: displayListing.title }
          ]}
        />

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
              <div className="flex justify-between items-start mb-4">
                <ListingHeader
                  title={displayListing.title}
                  category={displayListing.category}
                  type={displayListing.type}
                  rating={displayListing.rating}
                  price={displayListing.price}
                  status={listingStatus}
                  adId={displayListing.id}
                  userId={user?.id}
                  ownerId={listing?.user_id || displayListing.seller.id}
                  onStatusChange={handleStatusChange}
                />
                {id && (
                  <FavoriteButton 
                    listingId={id} 
                    size="default" 
                    variant="outline"
                    showText
                  />
                )}
              </div>

              <ListingDetailTabs
                description={displayListing.description}
                availability={displayListing.availability}
                delivery={displayListing.delivery}
                deliveryFee={displayListing.deliveryFee}
                location={displayListing.location}
                paymentMethods={displayListing.paymentMethods}
              />
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
            <SecurityInfo />
          </div>
        </div>

        {/* Anúncios relacionados */}
        {listing && (
          <SimilarListings 
            currentListingId={id || ""}
            category={listing.category}
          />
        )}
      </div>
    </Layout>
  );
};

export default ListingDetail;
