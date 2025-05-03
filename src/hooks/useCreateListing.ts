
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ListingFormData } from "@/types/listing";

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
    
    // Debug: Log the user object to ensure we have a valid ID
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
      // Ensure we have a valid user ID before proceeding
      if (!user.id) {
        throw new Error("ID do usuário não disponível. Por favor, faça login novamente.");
      }

      // 1. Inserir o anúncio no banco de dados
      const { data: adData, error: adError } = await supabase
        .from('ads')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          type: formData.type,
          availability: formData.availability,
          delivery: formData.delivery,
          delivery_fee: formData.delivery ? parseFloat(formData.deliveryFee) : null,
          payment_methods: formData.paymentMethods,
        })
        .select('id')
        .single();
      
      if (adError) throw adError;
      
      // 2. Fazer upload das imagens para o Storage
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}-${i}.${fileExt}`;
        const filePath = `ad-images/${adData.id}/${fileName}`;
        
        // Upload da imagem
        const { error: uploadError } = await supabase
          .storage
          .from('ads')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        // Pegar a URL pública da imagem
        const { data: urlData } = supabase
          .storage
          .from('ads')
          .getPublicUrl(filePath);
          
        // Salvar referência da imagem
        const { error: imageError } = await supabase
          .from('ad_images')
          .insert({
            ad_id: adData.id,
            image_url: urlData.publicUrl,
            position: i,
          });
          
        if (imageError) throw imageError;
      }
      
      toast({
        title: "Anúncio criado",
        description: "Seu anúncio foi publicado com sucesso!"
      });
      
      // Redireciona para a página do anúncio
      navigate(`/anuncio/${adData.id}`);
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
