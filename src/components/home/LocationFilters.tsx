
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  StateSelect, 
  CitySelect, 
  CondominiumSelect 
} from "../listings/explore/location-filter";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const LocationFilters = () => {
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [selectedCondominiumId, setSelectedCondominiumId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    let queryParams = new URLSearchParams();

    if (selectedStateId) {
      queryParams.append("stateId", selectedStateId);
    }
    
    if (selectedCityId) {
      queryParams.append("cityId", selectedCityId);
    }
    
    if (selectedCondominiumId) {
      queryParams.append("condominiumId", selectedCondominiumId);
    }

    const searchQuery = queryParams.toString();
    navigate(`/explorar${searchQuery ? `?${searchQuery}` : ''}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <h3 className="font-medium text-lg mb-4">Filtrar por localização</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StateSelect
          selectedStateId={selectedStateId}
          setSelectedStateId={setSelectedStateId}
        />
        
        <CitySelect
          selectedStateId={selectedStateId}
          selectedCityId={selectedCityId}
          setSelectedCityId={setSelectedCityId}
        />
        
        <CondominiumSelect
          selectedCityId={selectedCityId}
          selectedCondominiumId={selectedCondominiumId}
          setSelectedCondominiumId={setSelectedCondominiumId}
        />
      </div>
      
      <Button 
        className="w-full mt-4" 
        onClick={handleSearch}
      >
        <Search className="mr-2 h-4 w-4" />
        Buscar anúncios
      </Button>
    </div>
  );
};

export default LocationFilters;
