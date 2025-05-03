
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
import { useToast } from "@/components/ui/use-toast";

const CreateListing = () => {
  const [storageError, setStorageError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Ensure the storage bucket exists when the component mounts
  useEffect(() => {
    console.log("CreateListing: Verificando se o bucket existe...");
    ensureStorageBucket('ads')
      .then(() => {
        console.log("CreateListing: Bucket verificado com sucesso");
      })
      .catch(err => {
        console.error("CreateListing: Erro ao verificar/criar bucket:", err);
        setStorageError("Não foi possível configurar o armazenamento de imagens. Algumas funcionalidades podem não estar disponíveis.");
        toast({
          title: "Erro de configuração",
          description: "Não foi possível configurar o armazenamento de imagens. Tente novamente mais tarde.",
          variant: "destructive"
        });
      });
  }, [toast]);
  
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
