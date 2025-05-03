
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ListingStatus } from "@/components/listings/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();

  useEffect(() => {
    const fetchListingDetails = async () => {
      if (!id) return;
      
      try {
        console.log("Fetching listing details for ID:", id);
        setIsLoading(true);
        
        // Fetch the listing data with user information
        const { data: listingData, error: listingError } = await supabase
          .from('ads')
          .select(`
            *,
            user:user_id (
              id,
              name,
              apartment,
              block,
              phone
            )
          `)
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
            setListingImages([]);
          } else {
            console.log("Image data:", imageData);
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

  // Prepare seller data 
  const seller = listing?.user ? {
    id: listing.user.id,
    name: listing.user.name,
    apartment: listing.user.apartment || "",
    block: listing.user.block || "",
    rating: 0, // Could fetch from ratings table if needed
    listings: 0, // Could count user's listings if needed
    phone: listing.user.phone || "",
  } : {
    id: "",
    name: "Carregando...",
    apartment: "...",
    block: "...",
    rating: 0,
    listings: 0,
    phone: "",
  };

  // Use dados reais se disponíveis, caso contrário use mock data
  const displayListing = listing ? {
    ...listing,
    seller: seller,
    rating: 0,
    type: listing.type || "produto",
    delivery: listing.delivery || false,
    deliveryFee: listing.delivery_fee || 0,
    paymentMethods: listing.payment_methods ? listing.payment_methods.split(', ') : ["Dinheiro", "Pix"],
  } : {
    id: id || "1",
    title: "Carregando anúncio...",
    price: 0,
    description: "Carregando descrição...",
    category: "...",
    type: "produto" as const,
    rating: 0,
    location: "...",
    status: listingStatus,
    seller: seller,
    availability: "...",
    delivery: false,
    deliveryFee: 0,
    paymentMethods: ["..."],
  };

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
