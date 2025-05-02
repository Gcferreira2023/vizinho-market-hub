
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Plus, X, Upload } from "lucide-react";

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

const CreateListing = () => {
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
  
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
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
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files).slice(0, 3 - images.length);
      
      if (images.length + selectedFiles.length > 3) {
        toast({
          title: "Limite de imagens",
          description: "Você pode enviar no máximo 3 imagens",
          variant: "destructive"
        });
        return;
      }
      
      // Criar URLs temporárias para visualização
      const newImageUrls = selectedFiles.map(file => URL.createObjectURL(file));
      
      setImages(prev => [...prev, ...selectedFiles]);
      setImageUrls(prev => [...prev, ...newImageUrls]);
    }
  };
  
  const removeImage = (index: number) => {
    // Libera a URL temporária
    URL.revokeObjectURL(imageUrls[index]);
    
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => prev.filter((_, i) => i !== index));
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
              <div className="space-y-4">
                <h3 className="font-medium">Imagens do produto/serviço</h3>
                <p className="text-sm text-gray-500">
                  Adicione até 3 imagens para ilustrar seu anúncio
                </p>
                
                <div className="grid grid-cols-3 gap-4">
                  {/* Preview de imagens */}
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square border rounded-md overflow-hidden">
                      <img 
                        src={url} 
                        alt={`Imagem ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-1"
                        onClick={() => removeImage(index)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ))}
                  
                  {/* Botão de upload */}
                  {images.length < 3 && (
                    <div className="aspect-square border border-dashed rounded-md flex flex-col items-center justify-center bg-gray-50">
                      <Input
                        id="images"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Label 
                        htmlFor="images"
                        className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
                      >
                        <Upload className="h-6 w-6 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Upload</span>
                      </Label>
                    </div>
                  )}
                </div>
              </div>
              
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
