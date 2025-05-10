
import { Button } from "@/components/ui/button";

interface FilterResetProps {
  resetFilters: () => void;
}

const FilterReset = ({ resetFilters }: FilterResetProps) => {
  return (
    <Button 
      variant="outline" 
      className="w-full"
      onClick={resetFilters}
    >
      Limpar Filtros
    </Button>
  );
};

export default FilterReset;
