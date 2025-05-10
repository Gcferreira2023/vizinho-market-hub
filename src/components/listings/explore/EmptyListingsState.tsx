
import { Button } from "@/components/ui/button";
import { Search, AlertCircle, RefreshCw } from "lucide-react";

interface EmptyListingsStateProps {
  searchTerm?: string;
  hasError?: boolean;
  hasFilters?: boolean;  // Added this prop
  onRetry?: () => void;
  onResetFilters?: () => void;
}

const EmptyListingsState = ({ 
  searchTerm, 
  hasError, 
  hasFilters, 
  onRetry, 
  onResetFilters 
}: EmptyListingsStateProps) => {
  // If there's an error, show error message with retry button
  if (hasError) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-lg p-8 text-center">
        <div className="flex flex-col items-center max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Erro ao carregar anúncios</h3>
          <p className="text-red-600 mb-6">
            Ocorreu um erro ao buscar os anúncios. Por favor, tente novamente.
          </p>
          <div className="flex gap-4">
            {onRetry && (
              <Button 
                variant="default" 
                onClick={onRetry}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Tentar novamente
              </Button>
            )}
            {onResetFilters && (
              <Button 
                variant="outline" 
                onClick={onResetFilters}
              >
                Limpar filtros
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Normal empty state (no results)
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 text-center">
      <div className="flex flex-col items-center max-w-md mx-auto">
        <Search className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">
          {searchTerm 
            ? `Nenhum resultado para "${searchTerm}"` 
            : "Nenhum anúncio encontrado"}
        </h3>
        <p className="text-gray-600 mb-6">
          {searchTerm 
            ? "Tente usar termos mais gerais ou verifique se há erros de digitação." 
            : hasFilters
              ? "Não encontramos anúncios com os filtros selecionados."
              : "Não encontramos anúncios disponíveis."}
        </p>
        {onResetFilters && hasFilters && (
          <Button onClick={onResetFilters}>
            Limpar filtros
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyListingsState;
