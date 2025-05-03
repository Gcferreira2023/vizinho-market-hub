
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEditListing } from "@/hooks/useEditListing";
import EditListingForm from "@/components/listings/EditListingForm";
import DeleteListingDialog from "@/components/listings/DeleteListingDialog";

const EditListing = () => {
  const { id } = useParams<{ id: string }>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const {
    formData,
    imageUrls,
    images,
    isLoading,
    isSaving,
    isDeleting,
    handleChange,
    handleSelectChange,
    handleCheckboxChange,
    handleImagesChange,
    fetchListingData,
    saveListing,
    deleteListing
  } = useEditListing(id || '');
  
  // Load listing data on component mount
  useEffect(() => {
    fetchListingData();
  }, [id]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveListing();
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando anúncio...</span>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Editar Anúncio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EditListingForm
              formData={formData}
              images={images}
              imageUrls={imageUrls}
              isSaving={isSaving}
              onImagesChange={handleImagesChange}
              handleChange={handleChange}
              handleSelectChange={handleSelectChange}
              handleCheckboxChange={handleCheckboxChange}
              onSubmit={handleSubmit}
              onDeleteClick={() => setIsDeleteDialogOpen(true)}
            />
          </CardContent>
        </Card>
        
        <DeleteListingDialog
          isOpen={isDeleteDialogOpen}
          isDeleting={isDeleting}
          onOpenChange={setIsDeleteDialogOpen}
          onDelete={deleteListing}
        />
      </div>
    </Layout>
  );
};

export default EditListing;
