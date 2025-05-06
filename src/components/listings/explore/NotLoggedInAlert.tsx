
import { AlertCircle, Home } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";

const NotLoggedInAlert = () => {
  return (
    <Alert className="mb-6 bg-green-50 border-green-200 text-green-700">
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5" />
          <AlertDescription>
            Navegue e contate vendedores <strong>sem precisar se cadastrar</strong>. Apenas anunciantes precisam criar conta.
          </AlertDescription>
        </div>
        
        <div className="flex items-start gap-2 mt-1">
          <Home className="h-4 w-4 mt-0.5" />
          <AlertDescription>
            <strong>Vantagem para cadastrados:</strong> <Link to="/cadastro" className="underline">Crie uma conta</Link> para filtrar anúncios do seu condomínio e encontrar ofertas próximas de você!
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};

export default NotLoggedInAlert;
