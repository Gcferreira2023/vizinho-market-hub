
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import ImagePreview from "./images/ImagePreview";
import ImageUploader from "./images/ImageUploader";
import EmptyState from "./images/EmptyState";

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

  const handleAddImages = (newFiles: File[]) => {
    // Criar URLs temporárias para visualização
    const newImageUrls = newFiles.map(file => URL.createObjectURL(file));
    
    onImagesChange([...images, ...newFiles], [...imageUrls, ...newImageUrls]);
  };
  
  const removeImage = (index: number) => {
    // Libera a URL temporária
    URL.revokeObjectURL(imageUrls[index]);
    
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedUrls = imageUrls.filter((_, i) => i !== index);
    
    onImagesChange(updatedImages, updatedUrls);
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
            <ImagePreview
              key={index}
              url={url}
              index={index}
              onRemove={removeImage}
            />
          ))}
          
          {/* Botão de upload */}
          {images.length < maxImages && (
            <ImageUploader
              onAddImages={handleAddImages}
              remainingSlots={maxImages - images.length}
              maxImages={maxImages}
            />
          )}
        </div>
        
        {images.length === 0 && <EmptyState />}
      </CardContent>
    </Card>
  );
};

export default ListingImageManager;
