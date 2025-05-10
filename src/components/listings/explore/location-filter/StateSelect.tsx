
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { State } from "@/types/location";
import { fetchStates } from "@/services/location/locationService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      if (!isLoading && !loadError && states.length > 0) return; // Don't reload if already loaded successfully
      
      setIsLoading(true);
      setLoadError(null);
      
      try {
        console.log(`Iniciando carregamento de estados (tentativa ${retryCount + 1})...`);
        
        setTimeout(() => {
          // Force UI update after a timeout if still loading
          if (isLoading) {
            setIsLoading(false);
          }
        }, 8000);
        
        const statesData = await fetchStates();
        
        if (statesData && statesData.length > 0) {
          console.log(`${statesData.length} estados carregados com sucesso:`, statesData);
          setStates(statesData);
          setLoadError(null);
          
          // Notify successful load
          if (retryCount > 0) {
            toast({
              title: "Dados carregados com sucesso",
              description: "Lista de estados atualizada."
            });
          }
        } else {
          console.log("Nenhum estado encontrado ou erro ao carregar");
          setLoadError("Nenhum estado encontrado");
          
          // Use mock data as fallback
          setStates([
            { id: "1", name: "São Paulo", uf: "SP" },
            { id: "2", name: "Rio de Janeiro", uf: "RJ" },
            { id: "3", name: "Minas Gerais", uf: "MG" }
          ]);
        }
      } catch (error) {
        console.error("Error fetching states:", error);
        setLoadError("Erro ao carregar estados");
        
        // Use mock data as fallback
        setStates([
          { id: "1", name: "São Paulo", uf: "SP" },
          { id: "2", name: "Rio de Janeiro", uf: "RJ" },
          { id: "3", name: "Minas Gerais", uf: "MG" }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStates();
  }, [retryCount, toast, isLoading, loadError, states.length]);

  // Handle state selection
  const handleStateChange = (value: string) => {
    setSelectedStateId(value === "all" ? null : value);
  };
  
  // Retry loading states
  const handleRetry = () => {
    setRetryCount(prevCount => prevCount + 1);
    toast({
      title: "Tentando novamente",
      description: "Buscando lista de estados..."
    });
  };

  // States are always rendered, even when there's an error
  // This ensures the user can still interact with the app
  return (
    <div className="space-y-1">
      <Label htmlFor="state-select">Estado</Label>
      
      {isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <>
          {loadError && (
            <ErrorDisplay 
              title="Erro ao carregar estados" 
              message={loadError}
              variant="warning"
              onRetry={handleRetry}
              className="py-2 text-sm mb-2"
            />
          )}
          
          <Select 
            value={selectedStateId || "all"} 
            onValueChange={handleStateChange}
          >
            <SelectTrigger id="state-select" className={loadError ? "border-amber-300" : ""}>
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
        </>
      )}
    </div>
  );
};

export default StateSelect;
