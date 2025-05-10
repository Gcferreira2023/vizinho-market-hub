
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MobileFilterCategoryProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

const MobileFilterCategory = ({
  selectedCategory,
  setSelectedCategory,
}: MobileFilterCategoryProps) => {
  return (
    <div className="space-y-2">
      <Label>Categoria</Label>
      <Select
        value={selectedCategory || "all"}
        onValueChange={(value) => 
          setSelectedCategory(value === "all" ? null : value)
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Todas as categorias" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as categorias</SelectItem>
          <SelectItem value="Alimentos">Alimentos</SelectItem>
          <SelectItem value="Serviços">Serviços</SelectItem>
          <SelectItem value="Produtos Gerais">Produtos Gerais</SelectItem>
          <SelectItem value="produtos">Produtos Gerais</SelectItem>
          <SelectItem value="Vagas/Empregos">Vagas/Empregos</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MobileFilterCategory;
