
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
            // Em caso de erro, defina ao menos um array vazio
            setListingImages([]);
          } else {
            console.log("Image data:", imageData);
            // Certifique-se de que imageData não seja nulo antes de usar map
            const images = imageData && imageData.length > 0
              ? imageData.map(img => img.image_url)
              : ['/placeholder.svg'];
            setListingImages(images);
          }
        }
      } catch (error) {
        console.error("Error fetching listing details:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os detalhes deste anúncio",
          variant: "destructive"
        });
        // Defina um array vazio para garantir que não haja erros
        setListingImages([]);
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

  // Dados mock para quando não há dados reais ainda
  const mockListing = {
    id: id || "1",
    title: "Carregando anúncio...",
    price: 0,
    description: "Carregando descrição...",
    images: listingImages.length > 0 ? listingImages : ['/placeholder.svg'],
    category: "...",
    type: "produto" as const,
    rating: 0,
    location: "...",
    status: listingStatus,
    seller: {
      id: "",
      name: "Carregando...",
      apartment: "...",
      block: "...",
      rating: 0,
      listings: 0,
      phone: "",
    },
    availability: "...",
    delivery: false,
    deliveryFee: 0,
    paymentMethods: ["..."],
  };
  
  // Use dados reais se disponíveis, caso contrário use mock data
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
