
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface CategoryHeaderProps {
  categoryTitle: string;
}

const CategoryHeader = ({ categoryTitle }: CategoryHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{categoryTitle}</h1>
        <p className="text-gray-600 mt-1">
          Explore anúncios da categoria {categoryTitle.toLowerCase()}
        </p>
      </div>
      
      <div className="mt-4 md:mt-0">
        <Button asChild variant="outline">
          <Link to="/explorar">Ver todas as categorias</Link>
        </Button>
      </div>
    </div>
  );
};

export default CategoryHeader;
