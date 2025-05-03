
import { Button } from "@/components/ui/button";
import { initialListingFormData } from "@/types/listing";
import ListingImageManager from "@/components/listings/ListingImageManager";
import ListingFormSections from "@/components/listings/ListingFormSections";
import { useCreateListing } from "@/hooks/useCreateListing";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface CreateListingFormProps {
  storageAvailable?: boolean;
}

const CreateListingForm = ({ storageAvailable = true }: CreateListingFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    formData,
    handleChange,
    handleSelectChange,
    handleCheckboxChange,
    images,
    imageUrls,
    handleImagesChange,
    createListing,
    isLoading
  } = useCreateListing();
  
  // Notification when storage is available
  useEffect(() => {
    if (storageAvailable) {
      console.log("Storage is available, image uploads enabled");
    } else {
      console.warn("Storage is not available, image uploads disabled");
    }
  }, [storageAvailable]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createListing(formData, storageAvailable ? images : []);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ListingFormSections
        formData={formData}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
        handleCheckboxChange={handleCheckboxChange}
      />
      
      {storageAvailable ? (
        <ListingImageManager
          images={images}
          imageUrls={imageUrls}
          onImagesChange={handleImagesChange}
        />
      ) : (
        <Alert className="bg-amber-50">
          <Info className="h-4 w-4" />
          <AlertDescription>
            O upload de imagens não está disponível no momento. Você pode criar o anúncio sem imagens
            e adicioná-las mais tarde.
          </AlertDescription>
        </Alert>
      )}
      
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
