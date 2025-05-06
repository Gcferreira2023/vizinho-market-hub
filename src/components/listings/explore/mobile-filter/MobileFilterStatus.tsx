
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
        <Label>Status</Label>
        <Select
          value={selectedStatus || "all"}
          onValueChange={(value) => 
            setSelectedStatus(value === "all" ? null : value as ListingStatus)
          }
        >
          <SelectTrigger>
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
        />
        <Label htmlFor="show-sold-mobile">Mostrar itens vendidos</Label>
      </div>
    </div>
  );
};

export default MobileFilterStatus;
