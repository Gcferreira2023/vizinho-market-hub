
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { State } from "@/types/location";
import { fetchStates } from "@/services/location/locationService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";

interface StateSelectProps {
  selectedStateId: string | null;
  setSelectedStateId: (stateId: string | null) => void;
}

const StateSelect = ({ selectedStateId, setSelectedStateId }: StateSelectProps) => {
  const [states, setStates] = useState<State[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  // Load states when component mounts or retry is attempted
  useEffect(() => {
    const loadStates = async () => {
      if (!isLoading && !loadError) return; // Don't reload if already loaded successfully
      
      setIsLoading(true);
      setLoadError(null);
      
      try {
        console.log(`Iniciando carregamento de estados (tentativa ${retryCount + 1})...`);
        const statesData = await fetchStates();
        
        if (statesData && statesData.length > 0) {
          console.log(`${statesData.length} estados carregados com sucesso`);
          setStates(statesData);
          setLoadError(null);
        } else {
          console.log("Nenhum estado encontrado ou erro ao carregar");
          setLoadError("Nenhum estado encontrado");
        }
      } catch (error) {
        console.error("Error fetching states:", error);
        setLoadError("Erro ao carregar estados");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStates();
  }, [retryCount]);

  // Handle state selection
  const handleStateChange = (value: string) => {
    setSelectedStateId(value === "all" ? null : value);
  };
  
  // Retry loading states
  const handleRetry = () => {
    setRetryCount(prevCount => prevCount + 1);
  };

  return (
    <div className="space-y-1">
      <Label htmlFor="state-select">Estado</Label>
      
      {loadError ? (
        <div className="space-y-2">
          <ErrorDisplay 
            title="Erro ao carregar estados" 
            message={loadError}
            variant="warning"
            onRetry={handleRetry}
            className="py-2 text-sm"
          />
          <Select 
            value={selectedStateId || "all"} 
            onValueChange={handleStateChange}
          >
            <SelectTrigger id="state-select" className="border-amber-300">
              <SelectValue placeholder="Selecione um estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os estados</SelectItem>
              {/* Mock data as fallback */}
              <SelectItem value="1">São Paulo (SP)</SelectItem>
              <SelectItem value="2">Rio de Janeiro (RJ)</SelectItem>
              <SelectItem value="3">Minas Gerais (MG)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <Select 
          value={selectedStateId || "all"} 
          onValueChange={handleStateChange}
        >
          <SelectTrigger id="state-select">
            <SelectValue placeholder="Selecione um estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os estados</SelectItem>
            {states.map((state) => (
              <SelectItem key={state.id} value={state.id}>
                {state.name} ({state.uf})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default StateSelect;
