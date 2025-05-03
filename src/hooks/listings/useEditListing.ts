
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useListingForm } from "./useListingForm";
import { useListingImages, ExistingImage } from "./useListingImages";
import { EditListingFormData } from "@/types/listing";
import * as listingService from "@/services/listingService";

const initialFormData: EditListingFormData = {
  title: "",
  description: "",
  price: "",
  category: "",
  type: "produto",
  availability: "",
  delivery: false,
  deliveryFee: "0",
  paymentMethods: "Dinheiro, Pix",
};

export const useEditListing = (listingId: string) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    formData,
    setFormData,
    handleChange,
    handleSelectChange,
    handleCheckboxChange
  } = useListingForm(initialFormData);
  
  const {
    existingImages,
    setExistingImages,
    images,
    imageUrls,
    setImageUrls,
    handleImagesChange,
    validateImages
  } = useListingImages();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const fetchListingData = async () => {
    if (!user || !listingId) return;
    
    try {
      setIsLoading(true);
      
      // Buscar dados do anúncio
      const adData = await listingService.fetchListing(listingId);
      
      // Verificar se o anúncio pertence ao usuário logado
      if (!listingService.checkListingOwnership(adData, user.id)) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para editar este anúncio",
          variant: "destructive"
        });
        navigate(-1);
        return;
      }
      
      // Preencher formulário com dados existentes
      setFormData({
        title: adData.title || "",
        description: adData.description || "",
        price: adData.price?.toString() || "0",
        category: adData.category || "",
        type: adData.type || "produto",
        availability: adData.availability || "",
        delivery: adData.delivery || false,
        deliveryFee: adData.delivery_fee?.toString() || "0",
        paymentMethods: adData.payment_methods || "",
      });
      
      // Buscar imagens do anúncio
      const imageData = await listingService.fetchListingImages(listingId);
      
      setExistingImages(imageData || []);
      
      // Converter imagens existentes em URLs para o gerenciador de imagens
      const existingUrls = (imageData || []).map(img => img.image_url);
      setImageUrls(existingUrls);
      
    } catch (error: any) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do anúncio",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveListing = async () => {
    if (!user || !listingId) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para editar um anúncio",
        variant: "destructive"
      });
      return;
    }
    
    // Validar imagens
    if (!validateImages()) return;
    
    setIsSaving(true);
    
    try {
      // 1. Atualizar dados do anúncio
      await listingService.updateListing(listingId, formData);
      
      // 2. Tratar mudanças nas imagens
      // Obter IDs das imagens existentes que queremos manter
      const existingImageIds = existingImages.map(img => img.id);
      
      // Excluir imagens que foram removidas
      await listingService.deleteRemovedImages(listingId, existingImageIds);
      
      // 3. Fazer upload das novas imagens
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        
        // Upload da imagem
        const publicUrl = await listingService.uploadImage(
          file, 
          listingId, 
          user.id, 
          i
        );
        
        // Salvar referência da imagem
        await listingService.saveImageReference(
          listingId, 
          publicUrl, 
          existingImages.length + i
        );
      }
      
      toast({
        title: "Anúncio atualizado",
        description: "Seu anúncio foi atualizado com sucesso!"
      });
      
      // Redirecionar para página do anúncio
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
  
  const deleteListing = async () => {
    if (!user || !listingId) return;
    
    setIsDeleting(true);
    
    try {
      // Excluir o anúncio (imagens serão excluídas devido à chave estrangeira)
      await listingService.deleteListing(listingId);
      
      toast({
        title: "Anúncio excluído",
        description: "Seu anúncio foi excluído com sucesso"
      });
      
      // Redirecionar para página de perfil
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

  // Carregar dados do anúncio ao montar o componente
  useEffect(() => {
    fetchListingData();
  }, [listingId]);

  return {
    formData,
    imageUrls,
    images,
    isLoading,
    isSaving,
    isDeleting,
    handleChange,
    handleSelectChange,
    handleCheckboxChange,
    handleImagesChange,
    fetchListingData,
    saveListing,
    deleteListing
  };
};
