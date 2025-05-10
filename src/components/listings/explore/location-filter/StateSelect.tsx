
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
        console.log("Estados carregados:", statesData);
        
        if (statesData && statesData.length > 0) {
          setStates(statesData);
        } else {
          console.log("Nenhum estado encontrado na resposta");
          // Show a less disruptive message for empty states
          setStates([]);
          // Still allow the user to see "all states" option
        }
      } catch (error) {
        console.error("Error fetching states:", error);
        setLoadError("Erro ao carregar estados");
        // Don't show toast for this common error to avoid disrupting UX
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStates();
  }, [toast]);

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
      {loadError && (
        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
          <AlertCircle className="h-3 w-3" />
          <span>Erro ao carregar estados. Usando todos os estados.</span>
        </div>
      )}
    </div>
  );
};

export default StateSelect;
