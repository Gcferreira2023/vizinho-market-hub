
import { useState } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploaderProps {
  images: File[];
  imageUrls: string[];
  onImagesChange: (images: File[], urls: string[]) => void;
}

const ImageUploader = ({ images, imageUrls, onImagesChange }: ImageUploaderProps) => {
  const { toast } = useToast();

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
      
      onImagesChange([...images, ...selectedFiles], [...imageUrls, ...newImageUrls]);
    }
  };
  
  const removeImage = (index: number) => {
    // Libera a URL temporária
    URL.revokeObjectURL(imageUrls[index]);
    
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedUrls = imageUrls.filter((_, i) => i !== index);
    
    onImagesChange(updatedImages, updatedUrls);
  };

  return (
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
  );
};

export default ImageUploader;
