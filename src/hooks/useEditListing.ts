import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface EditListingFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  type: string;
  availability: string;
  delivery: boolean;
  deliveryFee: string;
  paymentMethods: string;
}

interface ExistingImage {
  id: string;
  image_url: string;
  position?: number;
  ad_id?: string;
}

export const useEditListing = (listingId: string) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<EditListingFormData>({
    title: "",
    description: "",
    price: "",
    category: "",
    type: "produto",
    availability: "",
    delivery: false,
    deliveryFee: "0",
    paymentMethods: "Dinheiro, Pix",
  });
  
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const fetchListingData = async () => {
    if (!user || !listingId) return;
    
    try {
      // Fetch listing data
      const { data: adData, error: adError } = await supabase
        .from('ads')
        .select('*')
        .eq('id', listingId)
        .single();
        
      if (adError) throw adError;
      
      // Check if the listing belongs to the logged in user
      if (adData.user_id !== user.id) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para editar este anúncio",
          variant: "destructive"
        });
        navigate(-1);
        return;
      }
      
      // Fill form with existing data
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
      
      // Fetch listing images
      const { data: imageData, error: imageError } = await supabase
        .from('ad_images')
        .select('*')
        .eq('ad_id', listingId)
        .order('position');
        
      if (imageError) throw imageError;
      
      setExistingImages(imageData || []);
      
      // Convert existing images to URLs for image manager
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleImagesChange = (newImages: File[], newUrls: string[]) => {
    // Track which existing images were kept and which were removed
    const keptExistingUrls = newUrls.filter(url => 
      existingImages.some(img => img.image_url === url)
    );
    
    // Update the list of existing images to keep
    const updatedExistingImages = existingImages.filter(img => 
      keptExistingUrls.includes(img.image_url)
    );
    
    setExistingImages(updatedExistingImages);
    
    // New images are the files that were added
    const actualNewImages = newImages.filter(file => 
      !existingImages.some(img => URL.createObjectURL(file) === img.image_url)
    );
    
    setImages(actualNewImages);
    setImageUrls(newUrls);
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
    
    if (imageUrls.length === 0) {
      toast({
        title: "Imagens obrigatórias",
        description: "Adicione pelo menos uma imagem ao seu anúncio",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // 1. Update listing data
      const { error: updateError } = await supabase
        .from('ads')
        .update({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          type: formData.type,
          availability: formData.availability,
          delivery: formData.delivery,
          delivery_fee: formData.delivery ? parseFloat(formData.deliveryFee) : null,
          payment_methods: formData.paymentMethods,
          updated_at: new Date().toISOString(),
        })
        .eq('id', listingId);
      
      if (updateError) throw updateError;
      
      // 2. Handle image changes
      
      // Get existing image IDs that we want to keep
      const existingImageIds = existingImages.map(img => img.id);
      
      // Delete images that were removed
      const { error: deleteImagesError } = await supabase
        .from('ad_images')
        .delete()
        .eq('ad_id', listingId)
        .not('id', 'in', existingImageIds.length > 0 ? `(${existingImageIds.join(',')})` : '(-1)');
      
      if (deleteImagesError) throw deleteImagesError;
      
      // 3. Upload new images
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}-${i}.${fileExt}`;
        const filePath = `ad-images/${listingId}/${fileName}`;
        
        // Upload image
        const { error: uploadError } = await supabase
          .storage
          .from('ads')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: urlData } = supabase
          .storage
          .from('ads')
          .getPublicUrl(filePath);
          
        // Save image reference
        const { error: imageError } = await supabase
          .from('ad_images')
          .insert({
            ad_id: listingId,
            image_url: urlData.publicUrl,
            position: existingImages.length + i,
          });
          
        if (imageError) throw imageError;
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
  
  const deleteListing = async () => {
    if (!user || !listingId) return;
    
    setIsDeleting(true);
    
    try {
      // Delete the listing (images will be deleted due to the foreign key)
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', listingId);
        
      if (error) throw error;
      
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
