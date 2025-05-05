
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface EmptyListingsStateProps {
  searchTerm?: string;
  onReset?: () => void;
}

const EmptyListingsState = ({ searchTerm, onReset }: EmptyListingsStateProps) => {
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
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onReset && (
          <Button variant="outline" onClick={onReset} className="sm:mr-2">
            Limpar filtros
          </Button>
        )}
        <Button asChild>
          <Link to="/criar-anuncio">Seja o primeiro a anunciar</Link>
        </Button>
      </div>
    </div>
  );
};

export default EmptyListingsState;
