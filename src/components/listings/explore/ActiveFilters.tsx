
import { Building, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ActiveFiltersProps {
  selectedStateId: string | null;
  selectedCityId: string | null;
  selectedCondominiumId: string | null;
  isCondominiumFilter: boolean;
  userCondominiumId: string | undefined;
  selectedCategory: string | null;
}

const ActiveFilters = ({
  selectedStateId,
  selectedCityId,
  selectedCondominiumId,
  isCondominiumFilter,
  userCondominiumId,
  selectedCategory
}: ActiveFiltersProps) => {
  // Helper functions to get location details for active filter badges
  const getStateName = () => {
    return selectedStateId ? "Estado selecionado" : null;
  };
  
  const getCityName = () => {
    return selectedCityId ? "Cidade selecionada" : null;
  };
  
  const getCondominiumName = () => {
    return selectedCondominiumId ? "Condomínio selecionado" : null;
  };
  
  // Check if we have any active filters to display
  const hasActiveFilters = selectedStateId || selectedCityId || 
    selectedCondominiumId || isCondominiumFilter || selectedCategory;
  
  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap gap-2 my-4">
      <span className="text-sm font-medium text-gray-500 self-center">Filtros ativos:</span>
      
      {selectedStateId && (
        <Badge variant="outline" className="flex items-center gap-1 bg-gray-100">
          <MapPin size={12} />
          {getStateName()}
        </Badge>
      )}
      
      {selectedCityId && (
        <Badge variant="outline" className="flex items-center gap-1 bg-gray-100">
          <MapPin size={12} />
          {getCityName()}
        </Badge>
      )}
      
      {selectedCondominiumId && (
        <Badge variant="outline" className="flex items-center gap-1 bg-gray-100">
          <Building size={12} />
          {getCondominiumName()}
        </Badge>
      )}
      
      {isCondominiumFilter && userCondominiumId && (
        <Badge variant="outline" className="flex items-center gap-1 bg-primary/20 text-primary">
          <Building size={12} />
          Meu Condomínio
        </Badge>
      )}
      
      {selectedCategory && (
        <Badge variant="outline" className="flex items-center gap-1 bg-gray-100">
          {selectedCategory}
        </Badge>
      )}
    </div>
  );
};

export default ActiveFilters;
