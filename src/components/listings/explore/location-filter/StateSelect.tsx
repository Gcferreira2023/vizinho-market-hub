
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
          setLoadError("Nenhum estado encontrado");
          toast({
            variant: "destructive",
            title: "Sem dados de estados",
            description: "Não foi possível encontrar a lista de estados."
          });
        }
      } catch (error) {
        console.error("Error fetching states:", error);
        setLoadError("Erro ao carregar estados");
        toast({
          variant: "destructive",
          title: "Erro ao carregar estados",
          description: "Não foi possível carregar a lista de estados."
        });
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
      ) : loadError ? (
        <div className="text-sm text-destructive flex items-center gap-1 mt-1">
          <AlertCircle className="h-4 w-4" />
          <span>{loadError}</span>
        </div>
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
