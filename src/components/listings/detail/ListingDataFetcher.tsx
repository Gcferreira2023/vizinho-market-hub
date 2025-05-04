
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ListingStatus } from "@/components/listings/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface ListingDataFetcherProps {
  id?: string;
  children: (props: {
    listing: any;
    displayListing: any;
    listingImages: string[];
    listingStatus: ListingStatus;
    isLoading: boolean;
    handleStatusChange: (newStatus: ListingStatus) => void;
    viewCount: number;
  }) => React.ReactNode;
}

const ListingDataFetcher = ({ id, children }: ListingDataFetcherProps) => {
  const [listing, setListing] = useState<any>(null);
  const [listingImages, setListingImages] = useState<string[]>([]);
  const [listingStatus, setListingStatus] = useState<ListingStatus>("disponível");
  const [isLoading, setIsLoading] = useState(true);
  const [viewCount, setViewCount] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Função para incrementar visualização
  const incrementViewCount = async (adId: string) => {
    try {
      // Implemente aqui a lógica para incrementar a contagem de visualizações
      // Esta é uma simulação simples - em produção, você armazenaria isso no banco de dados
      setViewCount(prevCount => prevCount + 1);
    } catch (error) {
      console.error("Erro ao atualizar contagem de visualizações:", error);
    }
  };

  useEffect(() => {
    const fetchListingDetails = async () => {
      if (!id) return;
      
      try {
        console.log("Fetching listing details for ID:", id);
        setIsLoading(true);
        
        // Verify if the ID is a valid UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
          console.error("Invalid listing ID format, not a UUID:", id);
          throw new Error("ID de anúncio inválido");
        }
        
        // Fetch the listing data with user information and condominium info
        const { data: listingData, error: listingError } = await supabase
          .from('ads')
          .select(`
            *,
            user:user_id (
              id,
              name,
              apartment,
              block,
              phone,
              condominium_id
            ),
            condominium:condominium_id (
              id, 
              name
            )
          `)
          .eq('id', id)
          .single();
          
        if (listingError) {
          throw listingError;
        }
        
        if (!listingData) {
          throw new Error("Anúncio não encontrado");
        }
        
        console.log("Listing data:", listingData);
        
        if (listingData) {
          // Adicionar nome do condomínio ao objeto de listagem
          const listingWithCondominium = {
            ...listingData,
            condominium_name: listingData.condominium?.name || "Desconhecido"
          };
          
          setListing(listingWithCondominium);
          
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
          
          // Incrementar contador de visualizações (somente se não for o próprio usuário)
          if (user?.id !== listingData.user_id) {
            incrementViewCount(id);
          }
          
          // Simulação de quantidade de visualizações - remover em produção
          setViewCount(Math.floor(Math.random() * 50) + 5);
        }
      } catch (error) {
        console.error("Error fetching listing details:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os detalhes deste anúncio",
          variant: "destructive"
        });
        setListingImages([]);
        
        // Redirect to explore page after showing the error toast
        setTimeout(() => {
          navigate('/explorar');
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchListingDetails();
  }, [id, navigate, user?.id]);
  
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

  // Prepare seller data with condominium info
  const seller = listing?.user ? {
    id: listing.user.id,
    name: listing.user.name,
    apartment: listing.user.apartment || "",
    block: listing.user.block || "",
    rating: 0, // Could fetch from ratings table if needed
    listings: 0, // Could count user's listings if needed
    phone: listing.user.phone || "",
    condominium: {
      name: listing.condominium_name || "Desconhecido",
      id: listing.condominium_id || listing.user.condominium_id || ""
    }
  } : {
    id: "",
    name: "Carregando...",
    apartment: "...",
    block: "...",
    rating: 0,
    listings: 0,
    phone: "",
    condominium: {
      name: "Desconhecido",
      id: ""
    }
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
        handleStatusChange,
        viewCount
      })}
    </>
  );
};

export default ListingDataFetcher;
