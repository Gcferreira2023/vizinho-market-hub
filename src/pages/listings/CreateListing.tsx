
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ImageUploader from "@/components/listings/ImageUploader";
import ListingFormSections from "@/components/listings/ListingFormSections";
import { initialListingFormData, ListingFormData } from "@/types/listing";
import { ensureStorageBucket } from "@/utils/storageUtils";

const CreateListing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<ListingFormData>(initialListingFormData);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Ensure the storage bucket exists when the component mounts
  useEffect(() => {
    ensureStorageBucket('ads').catch(err => {
      console.error("Failed to ensure storage bucket exists:", err);
    });
  }, []);
  
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
    setImages(newImages);
    setImageUrls(newUrls);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar um anúncio",
        variant: "destructive"
      });
      return;
    }

    // Debug: Log the user object to ensure we have a valid ID
    console.log("Current user:", user);
    
    if (images.length === 0) {
      toast({
        title: "Imagens obrigatórias",
        description: "Adicione pelo menos uma imagem ao seu anúncio",
        variant: "destructive"
      });
      return;
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
      
    } catch (error: any) {
      console.error("Erro ao criar anúncio:", error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao criar seu anúncio",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Criar Anúncio</CardTitle>
            <CardDescription>
              Preencha os detalhes do seu produto ou serviço
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <ListingFormSections
                formData={formData}
                handleChange={handleChange}
                handleSelectChange={handleSelectChange}
                handleCheckboxChange={handleCheckboxChange}
              />
              
              <ImageUploader
                images={images}
                imageUrls={imageUrls}
                onImagesChange={handleImagesChange}
              />
              
              {/* Botões de ação */}
              <div className="pt-4 flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? "Publicando..." : "Publicar anúncio"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateListing;
