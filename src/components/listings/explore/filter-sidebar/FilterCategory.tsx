
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories, categoryMappings } from "@/constants/listings";

interface FilterCategoryProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

const FilterCategory = ({
  selectedCategory,
  setSelectedCategory,
}: FilterCategoryProps) => {
  // Get the category name if we have a selected category ID
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return null;
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };
  
  const handleCategoryChange = (value: string) => {
    const newCategory = value === "all" ? null : value;
    console.log(`Category changed to: ${newCategory} (original value: ${value})`);
    
    // Apply category selection
    setSelectedCategory(newCategory);
    
    // Log additional debug info
    if (newCategory) {
      console.log(`Selected category details - ID: ${newCategory}, Name: ${getCategoryName(newCategory)}`);
      
      if (categoryMappings.idToDb[newCategory]) {
        console.log(`Will be mapped to DB value: "${categoryMappings.idToDb[newCategory]}"`);
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label className={selectedCategory ? "text-primary font-medium" : ""}>
        Categoria {selectedCategory && <span className="text-xs ml-1 text-primary">• Ativo</span>}
      </Label>
      <Select
        value={selectedCategory || "all"}
        onValueChange={handleCategoryChange}
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
