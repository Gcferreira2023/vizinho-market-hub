
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface MobileFilterTypeProps {
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
}

const MobileFilterType = ({ 
  selectedType, 
  setSelectedType 
}: MobileFilterTypeProps) => {
  return (
    <div className="space-y-2">
      <Label>Tipo</Label>
      <div className="flex flex-col gap-3">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="produtos-mobile" 
            checked={selectedType === "produto"}
            onCheckedChange={() => setSelectedType(selectedType === "produto" ? null : "produto")}
          />
          <label 
            htmlFor="produtos-mobile"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Produtos
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="servicos-mobile" 
            checked={selectedType === "serviço"}
            onCheckedChange={() => setSelectedType(selectedType === "serviço" ? null : "serviço")}
          />
          <label 
            htmlFor="servicos-mobile"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Serviços
          </label>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterType;
