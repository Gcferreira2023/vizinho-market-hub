
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { State } from "@/types/location";
import { fetchStates } from "@/services/location/locationService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StateSelectProps {
  selectedStateId: string | null;
  setSelectedStateId: (stateId: string | null) => void;
}

const StateSelect = ({ selectedStateId, setSelectedStateId }: StateSelectProps) => {
  const [states, setStates] = useState<State[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadStates = async () => {
      setIsLoading(true);
      try {
        const statesData = await fetchStates();
        setStates(statesData);
      } catch (error) {
        console.error("Error fetching states:", error);
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
    setSelectedStateId(value || null);
  };

  return (
    <div className="space-y-1">
      <Label htmlFor="state-select">Estado</Label>
      {isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <Select 
          value={selectedStateId || ""} 
          onValueChange={handleStateChange}
        >
          <SelectTrigger id="state-select">
            <SelectValue placeholder="Selecione um estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os estados</SelectItem>
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
