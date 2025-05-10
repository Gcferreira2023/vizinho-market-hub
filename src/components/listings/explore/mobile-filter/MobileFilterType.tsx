
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
      <Label className={selectedType ? "text-primary font-medium" : ""}>
        Tipo {selectedType && <span className="text-xs ml-1 text-primary">• Ativo</span>}
      </Label>
      <div className="flex flex-col gap-3">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="produtos-mobile" 
            checked={selectedType === "produto"}
            onCheckedChange={(checked) => setSelectedType(checked ? "produto" : null)}
            className={selectedType === "produto" ? "border-primary text-primary" : ""}
          />
          <label 
            htmlFor="produtos-mobile"
            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${selectedType === "produto" ? "text-primary" : ""}`}
          >
            Produtos
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="servicos-mobile" 
            checked={selectedType === "serviço"}
            onCheckedChange={(checked) => setSelectedType(checked ? "serviço" : null)}
            className={selectedType === "serviço" ? "border-primary text-primary" : ""}
          />
          <label 
            htmlFor="servicos-mobile"
            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${selectedType === "serviço" ? "text-primary" : ""}`}
          >
            Serviços
          </label>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterType;
