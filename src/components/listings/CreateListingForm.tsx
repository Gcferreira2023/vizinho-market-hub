
import { Button } from "@/components/ui/button";
import { initialListingFormData } from "@/types/listing";
import ListingImageManager from "@/components/listings/ListingImageManager";
import ListingFormSections from "@/components/listings/ListingFormSections";
import { useCreateListing } from "@/hooks/useCreateListing";
import { useNavigate } from "react-router-dom";
import { useListingForm } from "@/hooks/listings/useListingForm";
import { useListingImages } from "@/hooks/listings/useListingImages";

const CreateListingForm = () => {
  const navigate = useNavigate();
  
  const {
    formData,
    handleChange,
    handleSelectChange,
    handleCheckboxChange
  } = useListingForm(initialListingFormData);
  
  const {
    images,
    imageUrls,
    handleImagesChange
  } = useListingImages();
  
  const { createListing, isLoading } = useCreateListing();
  
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
