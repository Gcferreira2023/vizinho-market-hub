
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
import { checkStorageBucket } from "@/services";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const CreateListing = () => {
  const [storageError, setStorageError] = useState<string | null>(null);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [isCheckingStorage, setIsCheckingStorage] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Verificar se o bucket de armazenamento existe quando o componente é montado
  useEffect(() => {
    const checkStorage = async () => {
      setIsCheckingStorage(true);
      
      // Verificar a autenticação primeiro
      if (!user) {
        console.log("CreateListing: Usuário não autenticado, verificando bucket apenas para leitura");
      }
      
      try {
        // Verifica se o bucket existe
        const bucketExists = await checkStorageBucket();
        
        if (bucketExists) {
          console.log("CreateListing: Bucket 'ads' encontrado e acessível");
          setIsStorageReady(true);
          setStorageError(null);
        } else {
          console.warn("CreateListing: Bucket 'ads' não encontrado ou não acessível");
          setIsStorageReady(false);
          setStorageError("O bucket de armazenamento 'ads' não está disponível. Você não poderá fazer upload de imagens.");
          toast({
            title: "Aviso",
            description: "Armazenamento de imagens não disponível. Você pode criar anúncios sem imagens.",
            variant: "warning"
          });
        }
      } catch (err: any) {
        console.error("CreateListing: Erro ao verificar bucket:", err);
        setIsStorageReady(false);
        setStorageError("Erro ao verificar armazenamento. Você não poderá fazer upload de imagens.");
        toast({
          title: "Aviso",
          description: "Armazenamento não disponível. Você pode criar anúncios sem imagens.",
          variant: "warning"
        });
      } finally {
        setIsCheckingStorage(false);
      }
    };
    
    checkStorage();
  }, [toast, user]);
  
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
