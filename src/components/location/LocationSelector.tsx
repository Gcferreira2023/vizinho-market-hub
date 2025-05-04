
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { suggestCondominium } from "@/services/location/locationService";
import { LocationFormData } from "@/types/location";
import { useLocationData } from "./useLocationData";
import LocationSelectField from "./LocationSelectField";
import CondominiumSelectField from "./CondominiumSelectField"; 
import NewCondominiumDialog from "./NewCondominiumDialog";

interface LocationSelectorProps {
  onLocationSelected: (location: LocationFormData) => void;
  initialValues?: {
    stateId?: string;
    cityId?: string;
    condominiumId?: string;
  };
}

const LocationSelector = ({ onLocationSelected, initialValues = {} }: LocationSelectorProps) => {
  const { toast } = useToast();
  const [isNewCondominiumDialogOpen, setIsNewCondominiumDialogOpen] = useState(false);
  
  const {
    states,
    cities,
    condominiums,
    selectedState,
    selectedCity,
    selectedCondominium,
    loading,
    setSelectedState,
    setSelectedCity,
    setSelectedCondominium,
    setLoading
  } = useLocationData({
    initialValues,
    onLocationSelected
  });

  const handleAddNewCondominium = async (name: string, address?: string) => {
    if (!selectedCity) {
      toast({
        title: "Selecione uma cidade",
        description: "Você precisa selecionar uma cidade antes de adicionar um novo condomínio",
        variant: "destructive"
      });
      return;
    }

    if (!name.trim()) {
      toast({
        title: "Nome necessário",
        description: "O nome do condomínio é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setLoading('suggestion', true);
    
    try {
      const newCondominiumId = await suggestCondominium(
        selectedCity, 
        name, 
        address
      );
      
      // Add the new condominium to the list temporarily, with "pending approval" status
      const newCondominium = {
        id: newCondominiumId,
        name: `${name} (Pendente aprovação)`,
        city_id: selectedCity,
        approved: false
      };
      
      // Update the condominiums list and select the new one
      setSelectedCondominium(newCondominiumId);
      
      toast({
        title: "Condomínio sugerido com sucesso",
        description: "Seu condomínio foi sugerido e está aguardando aprovação. Você já pode selecioná-lo.",
      });
      
      // Close the dialog
      setIsNewCondominiumDialogOpen(false);
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível sugerir o condomínio. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading('suggestion', false);
    }
  };

  return (
    <div className="space-y-4">
      <LocationSelectField
        label="Estado"
        placeholder="Selecione um estado"
        options={states}
        value={selectedState}
        onChange={setSelectedState}
        isLoading={loading.states}
      />
      
      {selectedState && (
        <LocationSelectField
          label="Cidade"
          placeholder="Selecione uma cidade"
          options={cities}
          value={selectedCity}
          onChange={setSelectedCity}
          isLoading={loading.cities}
          disabled={!selectedState}
        />
      )}
      
      {selectedCity && (
        <CondominiumSelectField
          condominiums={condominiums}
          value={selectedCondominium}
          onChange={setSelectedCondominium}
          isLoading={loading.condominiums}
          onAddNew={() => setIsNewCondominiumDialogOpen(true)}
        />
      )}

      <NewCondominiumDialog
        isOpen={isNewCondominiumDialogOpen}
        onOpenChange={setIsNewCondominiumDialogOpen}
        onSubmit={handleAddNewCondominium}
        isLoading={loading.suggestion}
      />
    </div>
  );
};

export default LocationSelector;
