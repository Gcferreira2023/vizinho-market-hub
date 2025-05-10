
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterResetProps {
  resetFilters: () => void;
}

const FilterReset = ({ resetFilters }: FilterResetProps) => {
  return (
    <Button 
      variant="outline" 
      className="w-full mt-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
      onClick={resetFilters}
    >
      <X size={16} />
      Limpar Filtros
    </Button>
  );
};

export default FilterReset;
