
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ListingStatus } from "@/components/listings/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MobileFilterStatusProps {
  selectedStatus: ListingStatus | null;
  setSelectedStatus: (status: ListingStatus | null) => void;
  showSoldItems: boolean;
  setShowSoldItems: (show: boolean) => void;
}

const MobileFilterStatus = ({
  selectedStatus,
  setSelectedStatus,
  showSoldItems,
  setShowSoldItems,
}: MobileFilterStatusProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className={selectedStatus ? "text-primary font-medium" : ""}>
          Status {selectedStatus && <span className="text-xs ml-1 text-primary">• Ativo</span>}
        </Label>
        <Select
          value={selectedStatus || "all"}
          onValueChange={(value) => 
            setSelectedStatus(value === "all" ? null : value as ListingStatus)
          }
        >
          <SelectTrigger className={selectedStatus ? "border-primary" : ""}>
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="disponível">Disponível</SelectItem>
            <SelectItem value="reservado">Reservado</SelectItem>
            <SelectItem value="vendido">Vendido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Checkbox
          id="show-sold-mobile"
          checked={showSoldItems}
          onCheckedChange={(checked) => setShowSoldItems(!!checked)}
          className={!showSoldItems ? "border-primary text-primary" : ""}
        />
        <Label 
          htmlFor="show-sold-mobile"
          className={!showSoldItems ? "text-primary font-medium" : ""}
        >
          Mostrar itens vendidos
          {!showSoldItems && <span className="text-xs ml-1 text-primary block">• Filtro ativo</span>}
        </Label>
      </div>
    </div>
  );
};

export default MobileFilterStatus;
