
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
import { AlertCircle, Info } from "lucide-react";
import CreateListingForm from "@/components/listings/CreateListingForm";
import { checkStorageBucket } from "@/services/listingService";
import { useToast } from "@/components/ui/use-toast";

const CreateListing = () => {
  const [storageError, setStorageError] = useState<string | null>(null);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [isCheckingStorage, setIsCheckingStorage] = useState(true);
  const { toast } = useToast();
  
  // Check if the storage bucket exists when the component mounts
  useEffect(() => {
    const checkStorage = async () => {
      setIsCheckingStorage(true);
      try {
        const bucketExists = await checkStorageBucket();
        
        if (bucketExists) {
          console.log("CreateListing: Bucket encontrado e acessível");
          setIsStorageReady(true);
          setStorageError(null);
        } else {
          console.warn("CreateListing: Bucket não acessível ou não existe");
          setIsStorageReady(false);
          setStorageError("Não foi possível acessar o armazenamento de imagens. Algumas funcionalidades podem não estar disponíveis.");
          toast({
            title: "Aviso",
            description: "Você pode criar anúncios, mas a funcionalidade de imagens pode estar limitada.",
            variant: "warning"
          });
        }
      } catch (err: any) {
        console.error("CreateListing: Erro ao verificar bucket:", err);
        setIsStorageReady(false);
        setStorageError("Não foi possível configurar o armazenamento de imagens. Algumas funcionalidades podem não estar disponíveis.");
        toast({
          title: "Aviso",
          description: "Você pode criar anúncios, mas sem adicionar imagens no momento.",
          variant: "warning"
        });
      } finally {
        setIsCheckingStorage(false);
      }
    };
    
    checkStorage();
  }, [toast]);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {storageError && (
          <Alert variant="warning" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Aviso</AlertTitle>
            <AlertDescription>{storageError}</AlertDescription>
          </Alert>
        )}
        
        {!isStorageReady && !storageError && isCheckingStorage && (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Verificando armazenamento</AlertTitle>
            <AlertDescription>Preparando o sistema de armazenamento de imagens...</AlertDescription>
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
            <CreateListingForm storageAvailable={isStorageReady} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateListing;
