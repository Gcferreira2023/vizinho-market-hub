
import { useState } from "react";
import { X, Upload, Camera, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";

interface ListingImageManagerProps {
  images: File[];
  imageUrls: string[];
  onImagesChange: (images: File[], urls: string[]) => void;
  maxImages?: number;
  showTitle?: boolean;
}

const ListingImageManager = ({
  images,
  imageUrls,
  onImagesChange,
  maxImages = 3,
  showTitle = true,
}: ListingImageManagerProps) => {
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files).slice(0, maxImages - images.length);
      
      if (images.length + selectedFiles.length > maxImages) {
        toast({
          title: "Limite de imagens",
          description: `Você pode enviar no máximo ${maxImages} imagens`,
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

  const takePhoto = async () => {
    try {
      // Feature detection
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          title: "Câmera não suportada",
          description: "Seu navegador não suporta acesso à câmera",
          variant: "destructive"
        });
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      // Create video element to preview camera
      const videoElement = document.createElement('video');
      videoElement.srcObject = stream;
      
      // Create a canvas element to capture the frame
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error("Não foi possível criar contexto de canvas");
      }
      
      // Open a drawer or modal with camera feed
      // This is a simplified version - in a real app, you'd create a proper UI for this
      await new Promise(resolve => {
        videoElement.onloadedmetadata = () => {
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;
          
          // Start playing the video
          videoElement.play();
          
          // After a short delay to ensure video is playing
          setTimeout(() => {
            // Capture frame
            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            
            // Stop all video tracks
            stream.getTracks().forEach(track => track.stop());
            
            // Convert to Blob
            canvas.toBlob(blob => {
              if (!blob) {
                toast({
                  title: "Erro",
                  description: "Não foi possível capturar a foto",
                  variant: "destructive"
                });
                resolve(null);
                return;
              }
              
              // Create a File from the Blob
              const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
              
              // Create URL for preview
              const imageUrl = URL.createObjectURL(file);
              
              // Update state with new image
              onImagesChange([...images, file], [...imageUrls, imageUrl]);
              
              resolve(null);
            }, 'image/jpeg');
          }, 300);
        };
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Erro na câmera",
        description: "Não foi possível acessar a câmera do dispositivo",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="border-dashed border-gray-300">
      <CardContent className="p-4 space-y-4">
        {showTitle && (
          <>
            <h3 className="font-medium">Imagens do produto/serviço</h3>
            <p className="text-sm text-gray-500">
              Adicione até {maxImages} imagens para ilustrar seu anúncio
            </p>
          </>
        )}
        
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
          
          {/* Botões de upload */}
          {images.length < maxImages && (
            <div className="aspect-square border border-dashed rounded-md flex flex-col items-center justify-center bg-gray-50">
              <Input
                id="images"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                multiple
              />
              <div className="grid grid-cols-2 gap-2 p-2 w-full h-full">
                <Label 
                  htmlFor="images"
                  className="cursor-pointer flex flex-col items-center justify-center rounded hover:bg-gray-100"
                >
                  <Upload className="h-6 w-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Upload</span>
                </Label>
                
                <Button
                  type="button"
                  variant="ghost"
                  className="flex flex-col items-center justify-center h-full rounded hover:bg-gray-100"
                  onClick={takePhoto}
                >
                  <Camera className="h-6 w-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Câmera</span>
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {images.length === 0 && (
          <div className="flex items-center justify-center py-4 text-gray-500">
            <ImageIcon className="mr-2 h-5 w-5" />
            <span className="text-sm">Adicione pelo menos uma imagem</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ListingImageManager;
