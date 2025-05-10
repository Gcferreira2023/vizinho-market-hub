
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import * as listingService from "@/services";

export const useListingDeleter = (
  listingId: string,
  setIsDeleting: (value: boolean) => void
) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const deleteListing = async () => {
    if (!user || !listingId) return;
    
    setIsDeleting(true);
    
    try {
      // Delete the listing
      await listingService.deleteListing(listingId);
      
      toast({
        title: "Anúncio excluído",
        description: "Seu anúncio foi excluído com sucesso"
      });
      
      // Redirect to profile page
      navigate('/perfil');
      
    } catch (error: any) {
      console.error("Erro ao excluir anúncio:", error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao excluir seu anúncio",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteListing };
};
