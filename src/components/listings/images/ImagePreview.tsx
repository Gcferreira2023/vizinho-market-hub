
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  url: string;
  index: number;
  onRemove: (index: number) => void;
}

const ImagePreview = ({ url, index, onRemove }: ImagePreviewProps) => {
  return (
    <div className="relative aspect-square border rounded-md overflow-hidden">
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
        onClick={() => onRemove(index)}
      >
        <X size={16} />
      </Button>
    </div>
  );
};

export default ImagePreview;
