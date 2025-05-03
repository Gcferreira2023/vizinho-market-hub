
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { ListingFormData } from "@/types/listing";
import * as listingService from "@/services/listingService";

export const useCreateListing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  
  const createListing = async (formData: ListingFormData, images: File[]) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar um anúncio",
        variant: "destructive"
      });
      return false;
    }
    
    console.log("Current user:", user);
    
    if (images.length === 0) {
      toast({
        title: "Imagens obrigatórias",
        description: "Adicione pelo menos uma imagem ao seu anúncio",
        variant: "destructive"
      });
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Verify/create storage bucket
      await listingService.ensureStorageBucket();
      
      // Create user if doesn't exist
      const userId = await listingService.ensureUserExists(user);
      
      // Create the ad/listing
      const adId = await listingService.createListing(formData, userId);
      
      // Upload images and save references
      await listingService.uploadListingImages(images, adId, userId);
      
      toast({
        title: "Anúncio criado",
        description: "Seu anúncio foi publicado com sucesso!"
      });
      
      // Redirect to the ad page
      navigate(`/anuncio/${adId}`);
      return true;
      
    } catch (error: any) {
      console.error("Erro ao criar anúncio:", error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao criar seu anúncio",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    createListing,
    isLoading
  };
};
