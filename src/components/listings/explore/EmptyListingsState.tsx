
import { Button } from "@/components/ui/button";
import { ExternalLink, Filter, Search, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyListingsStateProps {
  searchTerm?: string;
  hasFilters?: boolean;
  onResetFilters?: () => void;
}

const EmptyListingsState = ({ 
  searchTerm, 
  hasFilters = false,
  onResetFilters
}: EmptyListingsStateProps) => {
  // Generate appropriate message based on search or filters
  const getMessage = () => {
    if (searchTerm) {
      return `Não encontramos resultados para "${searchTerm}"`;
    } else if (hasFilters) {
      return "Não encontramos anúncios com os filtros selecionados";
    }
    return "Não há anúncios disponíveis no momento";
  };

  // Generate appropriate action suggestions
  const getSubMessage = () => {
    if (searchTerm || hasFilters) {
      return "Tente utilizar termos mais gerais ou remova alguns filtros";
    }
    return "Seja o primeiro a criar um anúncio para seu condomínio";
  };

  return (
    <div className="text-center py-8 px-4 rounded-lg border border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center min-h-[300px]">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        {searchTerm ? (
          <Search className="h-8 w-8 text-gray-400" />
        ) : hasFilters ? (
          <Filter className="h-8 w-8 text-gray-400" />
        ) : (
          <ShoppingBag className="h-8 w-8 text-gray-400" />
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {getMessage()}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {getSubMessage()}
      </p>
      
      <div className="flex flex-wrap gap-3 justify-center">
        {(searchTerm || hasFilters) && onResetFilters && (
          <Button 
            variant="outline" 
            onClick={onResetFilters}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Remover filtros
          </Button>
        )}
        
        <Button asChild>
          <Link to="/criar-anuncio" className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Criar um anúncio
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default EmptyListingsState;
