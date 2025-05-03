
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { initialListingFormData, ListingFormData } from "@/types/listing";
import ListingImageManager from "@/components/listings/ListingImageManager";
import ListingFormSections from "@/components/listings/ListingFormSections";
import { useCreateListing } from "@/hooks/useCreateListing";

const CreateListingForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ListingFormData>(initialListingFormData);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  const { createListing, isLoading } = useCreateListing();
  
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
    await createListing(formData, images);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ListingFormSections
        formData={formData}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
        handleCheckboxChange={handleCheckboxChange}
      />
      
      <ListingImageManager
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
  );
};

export default CreateListingForm;
