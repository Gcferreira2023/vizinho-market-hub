
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ListingStatus } from "@/components/listings/StatusBadge";

interface ListingDataFetcherProps {
  id?: string;
  children: (props: {
    listing: any;
    displayListing: any;
    listingImages: string[];
    listingStatus: ListingStatus;
    isLoading: boolean;
    handleStatusChange: (newStatus: ListingStatus) => void;
  }) => React.ReactNode;
}

const ListingDataFetcher = ({ id, children }: ListingDataFetcherProps) => {
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

  return (
    <>
      {children({
        listing,
        displayListing,
        listingImages,
        listingStatus,
        isLoading,
        handleStatusChange
      })}
    </>
  );
};

export default ListingDataFetcher;
