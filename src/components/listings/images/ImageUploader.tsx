
import { Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploaderProps {
  onAddImages: (files: File[]) => void;
  remainingSlots: number;
  maxImages: number;
}

const ImageUploader = ({ onAddImages, remainingSlots, maxImages }: ImageUploaderProps) => {
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files).slice(0, remainingSlots);
      
      if (selectedFiles.length > remainingSlots) {
        toast({
          title: "Limite de imagens",
          description: `Você pode enviar no máximo ${maxImages} imagens`,
          variant: "destructive"
        });
        return;
      }
      
      onAddImages(selectedFiles);
    }
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
              
              // Pass the file to parent component
              onAddImages([file]);
              
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
    <div className="aspect-square border border-dashed rounded-md flex flex-col items-center justify-center bg-gray-50">
      <Input
        id="images"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
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
  );
};

export default ImageUploader;
