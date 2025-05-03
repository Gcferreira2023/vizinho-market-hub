
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ListingFormData } from "@/types/listing";
import { ensureStorageBucket } from "@/utils/storageUtils";

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
      // First, ensure the storage bucket exists before we try to upload
      console.log("Verificando se o bucket 'ads' existe antes de prosseguir...");
      await ensureStorageBucket('ads');
      console.log("Bucket 'ads' verificado com sucesso.");

      // Ensure we have a valid user ID before proceeding
      if (!user.id) {
        throw new Error("ID do usuário não disponível. Por favor, faça login novamente.");
      }

      // First check if user exists in the users table
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();
      
      console.log("Verificando usuário existente:", existingUser, userCheckError);
      
      // If user doesn't exist in the users table, create them
      if (userCheckError || !existingUser) {
        // Get user metadata from auth
        const userMeta = user.user_metadata || {};
        console.log("Metadados do usuário:", userMeta);
        
        // Insert the user into the users table
        const { error: createUserError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email || '',
            name: userMeta.full_name || user.email?.split('@')[0] || 'Usuário',
            password_hash: 'managed-by-auth', // Just a placeholder as password is managed by Auth
            apartment: userMeta.apartment || null,
            block: userMeta.block || null,
            phone: userMeta.phone || null,
          });
        
        if (createUserError) {
          console.error("Erro detalhado ao criar perfil de usuário:", createUserError);
          throw new Error(`Erro ao criar perfil de usuário: ${createUserError.message}`);
        }
        
        console.log("Usuário criado com sucesso na tabela users");
      }

      console.log("Inserindo anúncio com user_id:", user.id);
      // Now insert the ad with the user ID
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
      
      if (adError) {
        console.error("Erro ao inserir anúncio:", adError);
        throw adError;
      }
      
      console.log("Anúncio criado com ID:", adData.id);
      
      // 2. Upload the images to Storage
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}-${i}.${fileExt}`;
        const filePath = `ad-images/${adData.id}/${fileName}`;
        
        console.log(`Enviando imagem ${i+1}/${images.length}: ${filePath}`);
        
        // Upload da imagem
        const { error: uploadError } = await supabase
          .storage
          .from('ads')
          .upload(filePath, file);
          
        if (uploadError) {
          console.error("Erro ao fazer upload da imagem:", uploadError);
          throw uploadError;
        }
        
        // Get the public URL of the image
        const { data: urlData } = supabase
          .storage
          .from('ads')
          .getPublicUrl(filePath);
          
        console.log("URL pública da imagem:", urlData.publicUrl);
        
        // Save image reference
        const { error: imageError } = await supabase
          .from('ad_images')
          .insert({
            ad_id: adData.id,
            image_url: urlData.publicUrl,
            position: i,
          });
          
        if (imageError) {
          console.error("Erro ao salvar referência da imagem:", imageError);
          throw imageError;
        }
      }
      
      toast({
        title: "Anúncio criado",
        description: "Seu anúncio foi publicado com sucesso!"
      });
      
      // Redirect to the ad page
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
