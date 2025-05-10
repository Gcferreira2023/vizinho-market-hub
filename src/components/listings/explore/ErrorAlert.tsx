
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorAlertProps {
  retryLoadListings: () => void;
}

const ErrorAlert = ({ retryLoadListings }: ErrorAlertProps) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erro na comunicação</AlertTitle>
      <AlertDescription className="flex justify-between items-center">
        <span>Estamos com problemas para carregar os anúncios.</span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={retryLoadListings} 
          className="bg-white"
        >
          Tentar novamente
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;
