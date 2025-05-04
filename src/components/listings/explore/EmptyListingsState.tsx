
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface EmptyListingsStateProps {
  searchTerm?: string;
}

const EmptyListingsState = ({ searchTerm }: EmptyListingsStateProps) => {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-xl">
      <h2 className="text-xl font-medium mb-2">
        {searchTerm 
          ? `Nenhum resultado para "${searchTerm}"`
          : "Nenhum anúncio encontrado"}
      </h2>
      <p className="text-gray-600 mb-6">
        {searchTerm 
          ? "Tente buscar com palavras diferentes ou escolha outra categoria"
          : "Não há anúncios disponíveis para esta categoria no momento"}
      </p>
      <Button asChild>
        <Link to="/criar-anuncio">Seja o primeiro a anunciar</Link>
      </Button>
    </div>
  );
};

export default EmptyListingsState;
