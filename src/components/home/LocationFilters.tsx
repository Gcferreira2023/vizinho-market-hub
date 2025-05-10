
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  StateSelect, 
  CitySelect, 
  CondominiumSelect 
} from "../listings/explore/location-filter";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { testSupabaseConnection } from "@/utils/supabaseTest";

const LocationFilters = () => {
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [selectedCondominiumId, setSelectedCondominiumId] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    // Test Supabase connection before navigating
    const connectionTest = await testSupabaseConnection();
    if (!connectionTest.success) {
      setConnectionError(connectionTest.message);
      return;
    }
    
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
  
  const retryConnection = async () => {
    setConnectionError(null);
    const connectionTest = await testSupabaseConnection();
    if (!connectionTest.success) {
      setConnectionError(connectionTest.message);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <h3 className="font-medium text-lg mb-4">Filtrar por localização</h3>
      
      {connectionError && (
        <ErrorDisplay 
          title="Problema de conexão" 
          message={connectionError}
          onRetry={retryConnection}
          className="mb-4"
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <StateSelect
            selectedStateId={selectedStateId}
            setSelectedStateId={setSelectedStateId}
          />
        </div>
        
        <div className="flex flex-col">
          <CitySelect
            selectedStateId={selectedStateId}
            selectedCityId={selectedCityId}
            setSelectedCityId={setSelectedCityId}
          />
        </div>
        
        <div className="flex flex-col">
          <CondominiumSelect
            selectedCityId={selectedCityId}
            selectedCondominiumId={selectedCondominiumId}
            setSelectedCondominiumId={setSelectedCondominiumId}
          />
        </div>
      </div>
      
      <div className="mt-6 flex justify-center">
        <Button 
          onClick={handleSearch}
          size="lg"
          className="flex items-center justify-center gap-2"
        >
          <Search className="h-4 w-4" />
          Buscar anúncios
        </Button>
      </div>
    </div>
  );
};

export default LocationFilters;
