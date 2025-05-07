
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ListingDataFetcher = ({ 
  id,
  children 
}: { 
  id?: string;
  children: (data: {
    listing: any;
    displayListing: any;
    listingImages: string[];
    listingStatus: string;
    isLoading: boolean;
    handleStatusChange: (newStatus: string) => void;
    viewCount: number;
  }) => React.ReactNode;
}) => {
  const [listing, setListing] = useState(null);
  const [displayListing, setDisplayListing] = useState(null);
  const [listingImages, setListingImages] = useState<string[]>([]);
  const [listingStatus, setListingStatus] = useState("active");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [viewCount, setViewCount] = useState(0);
  
  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('ads')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      setListingStatus(newStatus);
      
      toast({
        title: "Sucesso",
        description: "Status do anúncio atualizado com sucesso!",
      });
    } catch (error: any) {
      console.error("Erro ao atualizar status do anúncio:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do anúncio.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const fetchListingData = async () => {
      setIsLoading(true);
      try {
        // Buscar dados do anúncio incluindo relação com usuário para obter o telefone
        const { data: adData, error: adError } = await supabase
          .from('ads')
          .select(`
            *,
            users:user_id (
              id,
              name,
              phone,
              apartment,
              block
            )
          `)
          .eq('id', id)
          .single();
          
        if (adError) throw adError;
        
        // Preparar os dados de exibição com as informações do vendedor
        const displayData = {
          ...adData,
          seller_name: adData.users?.name,
          phone: adData.users?.phone,
          apartment: adData.users?.apartment,
          block: adData.users?.block
        };
        
        setListing(adData);
        setDisplayListing(displayData);
        setListingStatus(adData.status);
        
        const { data: imageData, error: imgError } = await supabase
          .from('ad_images')
          .select('image_url')
          .eq('ad_id', id)
          .order('position');
          
        if (imgError) throw imgError;
        
        const imageUrls = imageData ? imageData.map(img => img.image_url) : [];
        setListingImages(imageUrls);
      } catch (error: any) {
        console.error("Erro ao buscar detalhes do anúncio:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os detalhes do anúncio.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchListingData();
    }
  }, [id, toast]);
  
  // Efeito para carregar e incrementar visualizações
  useEffect(() => {
    if (id && listing) {
      // Importar dinamicamente para evitar problemas de ciclo de dependência
      import('@/services/listings/listingViewService').then(viewService => {
        // Incrementar a visualização e atualizar o contador local
        viewService.incrementListingView(id).then(newCount => {
          if (newCount) {
            setViewCount(newCount);
          } else {
            // Usar o valor existente se disponível, ou 0 como padrão
            const existingCount = (listing as any)?.viewCount || 0;
            setViewCount(existingCount);
          }
        });
      });
    }
  }, [id, listing]);
  
  return children({
    listing,
    displayListing,
    listingImages,
    listingStatus,
    isLoading,
    handleStatusChange,
    viewCount: viewCount || ((listing as any)?.viewCount || 0)
  });
};

export default ListingDataFetcher;
