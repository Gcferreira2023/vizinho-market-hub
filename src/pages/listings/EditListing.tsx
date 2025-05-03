import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash2, Loader2 } from "lucide-react";
import ListingImageManager from "@/components/listings/ListingImageManager";

// Interface for extended ad data
interface ExtendedAdData {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  status: string;
  user_id: string;
  created_at: string;
  type: string;
  availability: string;
  delivery: boolean;
  delivery_fee: number;
  payment_methods: string;
}

// Categorias disponíveis no sistema
const categories = [
  { id: "alimentos", name: "Alimentos" },
  { id: "servicos", name: "Serviços" },
  { id: "produtos", name: "Produtos Gerais" },
  { id: "vagas", name: "Vagas/Empregos" },
];

// Tipos de anúncio
const types = [
  { id: "produto", name: "Produto" },
  { id: "servico", name: "Serviço" },
];

const EditListing = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
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
  
  // Convert existing images to a format compatible with our component
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Carregar dados do anúncio
  useEffect(() => {
    const fetchAdData = async () => {
      if (!user || !id) return;
      
      try {
        // Buscar dados do anúncio
        const { data: adData, error: adError } = await supabase
          .from('ads')
          .select('*')
          .eq('id', id)
          .single();
          
        if (adError) throw adError;
        
        // Verificar se o anúncio pertence ao usuário logado
        if (adData.user_id !== user.id) {
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para editar este anúncio",
            variant: "destructive"
          });
          navigate(-1);
          return;
        }
        
        // Cast to ExtendedAdData to handle additional properties
        const extendedAdData = adData as unknown as ExtendedAdData;
        
        // Preencher formulário com dados existentes
        setFormData({
          title: extendedAdData.title || "",
          description: extendedAdData.description || "",
          price: extendedAdData.price?.toString() || "0",
          category: extendedAdData.category || "",
          type: extendedAdData.type || "produto",
          availability: extendedAdData.availability || "",
          delivery: extendedAdData.delivery || false,
          deliveryFee: extendedAdData.delivery_fee?.toString() || "0",
          paymentMethods: extendedAdData.payment_methods || "",
        });
        
        // Buscar imagens do anúncio
        const { data: imageData, error: imageError } = await supabase
          .from('ad_images')
          .select('*')
          .eq('ad_id', id)
          .order('position');
          
        if (imageError) throw imageError;
        
        setExistingImages(imageData || []);
        
        // Convert existing images to URLs for our image manager component
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
    
    fetchAdData();
  }, [id, user, toast, navigate]);
  
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
  
  const handleImagesChange = (newImages: File[], newUrls: string[]) => {
    // We need to keep track of which existing images were kept and which were removed
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !id) {
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
      // 1. Atualizar dados do anúncio
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
        .eq('id', id);
      
      if (updateError) throw updateError;
      
      // 2. Handle image changes
      
      // Get existing image IDs that we want to keep
      const existingImageIds = existingImages.map(img => img.id);
      
      // Delete images that were removed
      const { error: deleteImagesError } = await supabase
        .from('ad_images')
        .delete()
        .eq('ad_id', id)
        .not('id', 'in', existingImageIds.length > 0 ? `(${existingImageIds.join(',')})` : '(-1)');
      
      if (deleteImagesError) throw deleteImagesError;
      
      // 3. Upload new images
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}-${i}.${fileExt}`;
        const filePath = `ad-images/${id}/${fileName}`;
        
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
            ad_id: id,
            image_url: urlData.publicUrl,
            position: existingImages.length + i,
          });
          
        if (imageError) throw imageError;
      }
      
      toast({
        title: "Anúncio atualizado",
        description: "Seu anúncio foi atualizado com sucesso!"
      });
      
      // Redireciona para a página do anúncio
      navigate(`/anuncio/${id}`);
      
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
  
  const handleDelete = async () => {
    if (!user || !id) return;
    
    setIsDeleting(true);
    
    try {
      // Excluir o anúncio (as imagens serão excluídas devido à foreign key)
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Anúncio excluído",
        description: "Seu anúncio foi excluído com sucesso"
      });
      
      // Redireciona para a página de perfil
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
      setIsDeleteDialogOpen(false);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando anúncio...</span>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center justify-between">
              <span>Editar Anúncio</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações básicas */}
              <div className="space-y-4">
                <h3 className="font-medium">Informações básicas</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Título do anúncio</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ex: Bolo de Chocolate Caseiro"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descreva seu produto ou serviço em detalhes..."
                    rows={5}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleSelectChange("type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {types.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0,00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>
              
              {/* Upload de imagens */}
              <ListingImageManager
                images={images}
                imageUrls={imageUrls}
                onImagesChange={handleImagesChange}
              />
              
              {/* Informações adicionais */}
              <div className="space-y-4">
                <h3 className="font-medium">Informações adicionais</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="availability">Disponibilidade</Label>
                  <Input
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    placeholder="Ex: Segunda a Sexta, das 09h às 18h"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentMethods">Formas de pagamento aceitas</Label>
                  <Input
                    id="paymentMethods"
                    name="paymentMethods"
                    value={formData.paymentMethods}
                    onChange={handleChange}
                    placeholder="Ex: Dinheiro, Pix, Cartão de crédito"
                  />
                </div>
              </div>
              
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
                  disabled={isSaving}
                >
                  {isSaving ? "Salvando..." : "Salvar alterações"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Diálogo de confirmação para exclusão */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir anúncio</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Excluindo..." : "Excluir"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default EditListing;
