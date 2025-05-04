
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import ListingFormSections from "@/components/listings/ListingFormSections";
import ListingImageManager from "@/components/listings/ListingImageManager";

interface EditListingFormProps {
  formData: any;
  images: File[];
  imageUrls: string[];
  isSaving: boolean;
  onImagesChange: (images: File[], urls: string[]) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onDeleteClick: () => void;
}

const EditListingForm = ({
  formData,
  images,
  imageUrls,
  isSaving,
  onImagesChange,
  handleChange,
  handleSelectChange,
  handleCheckboxChange,
  onSubmit,
  onDeleteClick
}: EditListingFormProps) => {
  const navigate = useNavigate();

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onDeleteClick}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir
        </Button>
      </div>
      
      <ListingFormSections
        formData={formData}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
        handleCheckboxChange={handleCheckboxChange}
      />
      
      <ListingImageManager
        images={images}
        imageUrls={imageUrls}
        onImagesChange={onImagesChange}
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
          disabled={isSaving}
        >
          {isSaving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
};

export default EditListingForm;
