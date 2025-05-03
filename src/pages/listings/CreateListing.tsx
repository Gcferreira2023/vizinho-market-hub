
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import CreateListingForm from "@/components/listings/CreateListingForm";
import { ensureStorageBucket } from "@/utils/storageUtils";

const CreateListing = () => {
  const [storageError, setStorageError] = useState<string | null>(null);
  
  // Ensure the storage bucket exists when the component mounts
  useEffect(() => {
    ensureStorageBucket('ads')
      .catch(err => {
        console.error("Failed to ensure storage bucket exists:", err);
        setStorageError("Não foi possível configurar o armazenamento de imagens. Algumas funcionalidades podem não estar disponíveis.");
      });
  }, []);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {storageError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{storageError}</AlertDescription>
          </Alert>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Criar Anúncio</CardTitle>
            <CardDescription>
              Preencha os detalhes do seu produto ou serviço
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateListingForm />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateListing;
