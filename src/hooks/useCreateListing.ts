
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
    
    // Only validate images if there are any to upload
    if (images.length > 0) {
      try {
        const hasStorageAccess = await listingService.checkStorageBucket();
        if (!hasStorageAccess) {
          toast({
            title: "Aviso",
            description: "Armazenamento de imagens não disponível. Seu anúncio será criado sem imagens.",
            variant: "warning"
          });
        }
      } catch (error) {
        console.error("Erro ao verificar armazenamento:", error);
      }
    }
    
    setIsLoading(true);
    
    try {
      // Create user if doesn't exist
      const userId = await listingService.ensureUserExists(user);
      
      // Create the ad/listing
      const adId = await listingService.createListing(formData, userId);
      
      // Try to upload images if there are any
      if (images.length > 0) {
        try {
          await listingService.uploadListingImages(images, adId, userId);
          toast({
            title: "Anúncio criado",
            description: "Seu anúncio foi publicado com sucesso!"
          });
        } catch (imageError: any) {
          console.error("Erro ao fazer upload de imagens:", imageError);
          toast({
            title: "Anúncio criado parcialmente",
            description: "Seu anúncio foi criado, mas não foi possível adicionar as imagens.",
            variant: "warning"
          });
        }
      } else {
        toast({
          title: "Anúncio criado",
          description: "Seu anúncio foi publicado com sucesso!"
        });
      }
      
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
