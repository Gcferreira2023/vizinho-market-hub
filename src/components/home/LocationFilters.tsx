
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  StateSelect, 
  CitySelect, 
  CondominiumSelect 
} from "../listings/explore/location-filter";
import { Button } from "@/components/ui/button";
import { Search, AlertTriangle } from "lucide-react";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { testSupabaseConnection } from "@/utils/supabaseTest";
import { useToast } from "@/components/ui/use-toast";

const LocationFilters = () => {
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [selectedCondominiumId, setSelectedCondominiumId] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Test connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      setTestingConnection(true);
      const connectionTest = await testSupabaseConnection();
      setConnectionError(connectionTest.success ? null : connectionTest.message);
      setTestingConnection(false);
    };
    
    checkConnection();
  }, []);

  const handleSearch = async () => {
    // Don't search if we're just testing connection
    if (testingConnection) return;
    
    setTestingConnection(true);
    
    // Test Supabase connection before navigating
    const connectionTest = await testSupabaseConnection();
    setTestingConnection(false);
    
    if (!connectionTest.success) {
      setConnectionError(connectionTest.message);
      toast({
        title: "Problema de conexão",
        description: "Não foi possível conectar-se ao servidor. Verifique sua conexão com a internet.",
        variant: "destructive"
      });
      return;
    }
    
    // Clear any previous connection error
    setConnectionError(null);
    
    // Build query params and navigate
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
    setTestingConnection(true);
    const connectionTest = await testSupabaseConnection();
    setConnectionError(connectionTest.success ? null : connectionTest.message);
    setTestingConnection(false);
    
    if (connectionTest.success) {
      toast({
        title: "Conexão restabelecida",
        description: "A conexão com o servidor foi restabelecida com sucesso!"
      });
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
          variant="warning"
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
          disabled={testingConnection}
        >
          {testingConnection ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              Verificando conexão...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Buscar anúncios
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default LocationFilters;
