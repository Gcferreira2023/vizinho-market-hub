
import { Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyListingsStateProps {
  searchTerm?: string;
  onReset?: () => void;
}

const EmptyListingsState = ({ searchTerm, onReset }: EmptyListingsStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-dashed mt-4">
      <Search size={48} className="text-gray-300 mb-4" />
      
      <h3 className="text-xl font-medium text-gray-700 mb-2">
        {searchTerm 
          ? `Nenhum resultado para "${searchTerm}"` 
          : "Nenhum anúncio encontrado"}
      </h3>
      
      <p className="text-gray-500 text-center mb-6 max-w-md">
        {searchTerm 
          ? "Tente outros termos de busca ou remova alguns filtros para ver mais resultados." 
          : "Não encontramos anúncios que correspondam aos filtros selecionados."}
      </p>
      
      {onReset && (
        <Button onClick={onReset} variant="outline" className="flex items-center gap-2">
          <RefreshCw size={16} />
          Limpar filtros
        </Button>
      )}
    </div>
  );
};

export default EmptyListingsState;
