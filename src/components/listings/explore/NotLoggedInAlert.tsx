
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const NotLoggedInAlert = () => {
  return (
    <Alert className="mb-6 bg-green-50 border-green-200 text-green-700">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Navegue e contate vendedores <strong>sem precisar se cadastrar</strong>. Apenas anunciantes precisam criar conta.
      </AlertDescription>
    </Alert>
  );
};

export default NotLoggedInAlert;
