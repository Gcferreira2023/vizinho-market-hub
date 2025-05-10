import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import * as listingService from "@/services";

export const useListingSaver = (
  listingId: string, 
  setIsSaving: (value: boolean) => void
) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const saveListing = async (
    formData: any,
    existingImages: any[],
    images: File[]
  ) => {
    if (!user || !listingId) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para editar um anúncio",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // 1. Update listing data
      await listingService.updateListing(listingId, formData);
      
      // 2. Handle image changes
      // Get IDs of existing images that we want to keep
      const existingImageIds = existingImages.map(img => img.id);
      
      // Delete images that were removed
      await listingService.deleteRemovedImages(listingId, existingImageIds);
      
      // 3. Upload new images
      if (images.length > 0) {
        await listingService.uploadListingImages(images, listingId, user.id);
      }
      
      toast({
        title: "Anúncio atualizado",
        description: "Seu anúncio foi atualizado com sucesso!"
      });
      
      // Redirect to listing page
      navigate(`/anuncio/${listingId}`);
      
    } catch (error: any) {
      console.error("Erro ao atualizar anúncio:", error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao atualizar seu anúncio",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return { saveListing };
};
