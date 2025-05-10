
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { State } from "@/types/location";
import { fetchStates } from "@/services/location/locationService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";

interface StateSelectProps {
  selectedStateId: string | null;
  setSelectedStateId: (stateId: string | null) => void;
}

const StateSelect = ({ selectedStateId, setSelectedStateId }: StateSelectProps) => {
  const [states, setStates] = useState<State[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadStates = async () => {
      setIsLoading(true);
      setLoadError(null);
      
      try {
        console.log("Iniciando carregamento de estados...");
        const statesData = await fetchStates();
        
        if (statesData && statesData.length > 0) {
          console.log(`${statesData.length} estados carregados com sucesso`);
          setStates(statesData);
        } else {
          console.log("Nenhum estado encontrado ou erro ao carregar");
          setLoadError("Erro ao carregar estados");
          // We'll still have mock data from the service
        }
      } catch (error) {
        console.error("Error fetching states:", error);
        setLoadError("Erro ao carregar estados");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStates();
  }, []);

  // Handle state selection
  const handleStateChange = (value: string) => {
    setSelectedStateId(value === "all" ? null : value);
  };

  return (
    <div className="space-y-1">
      <Label htmlFor="state-select">Estado</Label>
      {isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <Select 
          value={selectedStateId || "all"} 
          onValueChange={handleStateChange}
        >
          <SelectTrigger id="state-select" className={loadError ? "border-red-300" : ""}>
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
      {loadError && (
        <div className="text-xs text-red-500 flex items-center gap-1 mt-1">
          <AlertCircle className="h-3 w-3" />
          <span>{loadError}</span>
        </div>
      )}
    </div>
  );
};

export default StateSelect;
