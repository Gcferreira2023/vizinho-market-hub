
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Condominium } from "@/types/location";
import LocationSelectField from "./LocationSelectField";

interface CondominiumSelectFieldProps {
  condominiums: Condominium[];
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
  onAddNew: () => void;
  showAddNew?: boolean;
}

const CondominiumSelectField = ({
  condominiums,
  value,
  onChange,
  isLoading,
  onAddNew,
  showAddNew = true
}: CondominiumSelectFieldProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <Label htmlFor="condominium">Condomínio</Label>
        {showAddNew && (
          <Button 
            variant="ghost" 
            size="sm" 
            type="button"
            onClick={onAddNew}
            className="text-xs flex items-center px-2 h-8"
          >
            <PlusCircle className="h-3 w-3 mr-1" />
            Adicionar Novo
          </Button>
        )}
      </div>
      <LocationSelectField
        label="Condomínio"
        placeholder="Selecione um condomínio"
        options={condominiums}
        value={value}
        onChange={onChange}
        isLoading={isLoading}
        emptyMessage="Nenhum condomínio encontrado"
      />
    </div>
  );
};

export default CondominiumSelectField;
