
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/constants/listings";

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
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.name}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MobileFilterCategory;
