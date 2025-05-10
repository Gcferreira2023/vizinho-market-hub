
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
  // Função para obter o nome da categoria a partir do ID
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return null;
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  return (
    <div className="space-y-2">
      <Label className={selectedCategory ? "text-primary font-medium" : ""}>
        Categoria {selectedCategory && <span className="text-xs ml-1 text-primary">• Ativo</span>}
      </Label>
      <Select
        value={selectedCategory || "all"}
        onValueChange={(value) => 
          setSelectedCategory(value === "all" ? null : value)
        }
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
