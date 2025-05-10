
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterTypeProps {
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
}

const FilterType = ({
  selectedType,
  setSelectedType,
}: FilterTypeProps) => {
  return (
    <div className="space-y-2">
      <Label>Tipo</Label>
      <div className="flex flex-col gap-3">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="produtos" 
            checked={selectedType === "produto"}
            onCheckedChange={() => setSelectedType(selectedType === "produto" ? null : "produto")}
          />
          <label 
            htmlFor="produtos"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Produtos
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="servicos" 
            checked={selectedType === "serviço"}
            onCheckedChange={() => setSelectedType(selectedType === "serviço" ? null : "serviço")}
          />
          <label 
            htmlFor="servicos"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Serviços
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterType;
