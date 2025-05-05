
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const EmptyListingsState = () => {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
      <div className="max-w-md mx-auto">
        <h3 className="text-xl font-medium mb-2">Você ainda não possui anúncios</h3>
        <p className="text-gray-600 mb-6">Crie seu primeiro anúncio e comece a vender para seu condomínio!</p>
        <Button asChild size="lg">
          <Link to="/criar-anuncio">Criar meu primeiro anúncio</Link>
        </Button>
      </div>
    </div>
  );
};

export default EmptyListingsState;
