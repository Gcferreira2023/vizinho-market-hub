
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Condominium } from "@/types/location";
import { fetchCondominiumsByCity, suggestCondominium } from "@/services/location/locationService";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewCondominiumDialog from "@/components/location/NewCondominiumDialog";

interface CondominiumSelectProps {
  selectedCityId: string | null;
  selectedCondominiumId: string | null;
  setSelectedCondominiumId: (condominiumId: string | null) => void;
}

const CondominiumSelect = ({ 
  selectedCityId, 
  selectedCondominiumId, 
  setSelectedCondominiumId 
}: CondominiumSelectProps) => {
  const [condominiums, setCondominiums] = useState<Condominium[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewCondoDialogOpen, setIsNewCondoDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch condominiums when city changes
  useEffect(() => {
    if (!selectedCityId) {
      setCondominiums([]);
      setSelectedCondominiumId(null);
      return;
    }
    
    const loadCondominiums = async () => {
      setIsLoading(true);
      try {
        const condominiumsData = await fetchCondominiumsByCity(selectedCityId);
        setCondominiums(condominiumsData);
        
        // If we have condominiums and none selected, set the first one
        if (condominiumsData.length > 0 && !selectedCondominiumId) {
          setSelectedCondominiumId(condominiumsData[0].id);
        }
      } catch (error) {
        console.error("Error fetching condominiums:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar condomínios",
          description: "Não foi possível carregar a lista de condomínios."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCondominiums();
  }, [selectedCityId, setSelectedCondominiumId, toast]);

  // Handle condominium selection
  const handleCondominiumChange = (value: string) => {
    setSelectedCondominiumId(value === "all" ? null : value);
  };

  // Handle adding a new condominium
  const handleAddNewCondominium = async (name: string, address?: string) => {
    if (!selectedCityId) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, selecione uma cidade primeiro."
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const newCondominiumId = await suggestCondominium(selectedCityId, name, address);
      
      toast({
        title: "Condomínio sugerido com sucesso",
        description: "Seu condomínio foi sugerido e será revisado por nossos administradores."
      });
      
      // Refresh condominiums list
      const updatedCondominiums = await fetchCondominiumsByCity(selectedCityId);
      setCondominiums(updatedCondominiums);
      
      // Close dialog
      setIsNewCondoDialogOpen(false);
    } catch (error) {
      console.error("Error suggesting condominium:", error);
      toast({
        variant: "destructive",
        title: "Erro ao sugerir condomínio",
        description: "Não foi possível processar sua solicitação. Tente novamente mais tarde."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedCityId && !isLoading) {
    return null;
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <Label htmlFor="condominium-select">Condomínio</Label>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsNewCondoDialogOpen(true)}
          className="text-xs h-6 px-2 py-0"
          disabled={!selectedCityId}
        >
          <PlusCircle className="h-3 w-3 mr-1" />
          Adicionar Novo
        </Button>
      </div>
      
      {isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <Select 
          value={selectedCondominiumId || "all"} 
          onValueChange={handleCondominiumChange}
        >
          <SelectTrigger id="condominium-select">
            <SelectValue placeholder="Selecione um condomínio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os condomínios</SelectItem>
            {condominiums.map((condominium) => (
              <SelectItem key={condominium.id} value={condominium.id}>
                {condominium.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      <NewCondominiumDialog
        isOpen={isNewCondoDialogOpen}
        onOpenChange={setIsNewCondoDialogOpen}
        onSubmit={handleAddNewCondominium}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default CondominiumSelect;
