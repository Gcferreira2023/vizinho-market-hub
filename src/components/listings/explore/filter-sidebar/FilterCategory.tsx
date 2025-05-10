
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "@/constants/listings";

interface FilterCategoryProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

const FilterCategory = ({
  selectedCategory,
  setSelectedCategory,
}: FilterCategoryProps) => {
  // Log to debug category selection
  console.log(`FilterCategory rendering with selectedCategory: ${selectedCategory}`);

  return (
    <div className="space-y-2">
      <Label className={selectedCategory ? "text-primary font-medium" : ""}>
        Categoria {selectedCategory && <span className="text-xs ml-1 text-primary">• Ativo</span>}
      </Label>
      <Select
        value={selectedCategory || "all"}
        onValueChange={(value) => {
          console.log(`Category changed to: ${value}`);
          setSelectedCategory(value === "all" ? null : value);
        }}
      >
        <SelectTrigger className={selectedCategory ? "border-primary" : ""}>
          <SelectValue placeholder="Todas as categorias" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as categorias</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterCategory;
