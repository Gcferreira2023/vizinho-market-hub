
import { useEffect, useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Loader2, PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { City, Condominium, LocationFormData, State } from "@/types/location";
import { 
  fetchStates, 
  fetchCitiesByState, 
  fetchCondominiumsByCity,
  suggestCondominium
} from "@/services/location/locationService";

interface LocationSelectorProps {
  onLocationSelected: (location: LocationFormData) => void;
  initialValues?: {
    stateId?: string;
    cityId?: string;
    condominiumId?: string;
  };
}

const LocationSelector = ({ onLocationSelected, initialValues }: LocationSelectorProps) => {
  const { toast } = useToast();
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [condominiums, setCondominiums] = useState<Condominium[]>([]);
  const [selectedState, setSelectedState] = useState<string>(initialValues?.stateId || "");
  const [selectedCity, setSelectedCity] = useState<string>(initialValues?.cityId || "");
  const [selectedCondominium, setSelectedCondominium] = useState<string>(initialValues?.condominiumId || "");
  const [loading, setLoading] = useState({
    states: false,
    cities: false,
    condominiums: false,
    suggestion: false
  });
  const [isNewCondominiumDialogOpen, setIsNewCondominiumDialogOpen] = useState(false);
  const [newCondominiumData, setNewCondominiumData] = useState({
    name: "",
    address: ""
  });

  // Buscar estados
  useEffect(() => {
    const loadStates = async () => {
      setLoading(prev => ({ ...prev, states: true }));
      try {
        const statesData = await fetchStates();
        setStates(statesData);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os estados",
          variant: "destructive"
        });
      } finally {
        setLoading(prev => ({ ...prev, states: false }));
      }
    };
    
    loadStates();
  }, [toast]);

  // Buscar cidades quando o estado for selecionado
  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      return;
    }

    const loadCities = async () => {
      setLoading(prev => ({ ...prev, cities: true }));
      try {
        const citiesData = await fetchCitiesByState(selectedState);
        setCities(citiesData);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar as cidades",
          variant: "destructive"
        });
      } finally {
        setLoading(prev => ({ ...prev, cities: false }));
      }
    };
    
    loadCities();
  }, [selectedState, toast]);

  // Buscar condomínios quando a cidade for selecionada
  useEffect(() => {
    if (!selectedCity) {
      setCondominiums([]);
      return;
    }

    const loadCondominiums = async () => {
      setLoading(prev => ({ ...prev, condominiums: true }));
      try {
        const condominiumsData = await fetchCondominiumsByCity(selectedCity);
        setCondominiums(condominiumsData);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os condomínios",
          variant: "destructive"
        });
      } finally {
        setLoading(prev => ({ ...prev, condominiums: false }));
      }
    };
    
    loadCondominiums();
  }, [selectedCity, toast]);

  // Notificar quando localização completa for selecionada
  useEffect(() => {
    if (selectedState && selectedCity && selectedCondominium) {
      onLocationSelected({
        stateId: selectedState,
        cityId: selectedCity,
        condominiumId: selectedCondominium
      });
    }
  }, [selectedState, selectedCity, selectedCondominium, onLocationSelected]);

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    setSelectedCity("");
    setSelectedCondominium("");
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    setSelectedCondominium("");
  };

  const handleCondominiumChange = (value: string) => {
    setSelectedCondominium(value);
  };

  const handleAddNewCondominium = async () => {
    if (!selectedCity) {
      toast({
        title: "Selecione uma cidade",
        description: "Você precisa selecionar uma cidade antes de adicionar um novo condomínio",
        variant: "destructive"
      });
      return;
    }

    if (!newCondominiumData.name.trim()) {
      toast({
        title: "Nome necessário",
        description: "O nome do condomínio é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setLoading(prev => ({ ...prev, suggestion: true }));
    
    try {
      const newCondominiumId = await suggestCondominium(
        selectedCity, 
        newCondominiumData.name, 
        newCondominiumData.address
      );
      
      // Adicionar o novo condomínio à lista temporariamente, com status de "pendente aprovação"
      const newCondominium: Condominium = {
        id: newCondominiumId,
        name: `${newCondominiumData.name} (Pendente aprovação)`,
        city_id: selectedCity,
        approved: false
      };
      
      setCondominiums(prev => [...prev, newCondominium]);
      setSelectedCondominium(newCondominiumId);
      
      toast({
        title: "Condomínio sugerido com sucesso",
        description: "Seu condomínio foi sugerido e está aguardando aprovação. Você já pode selecioná-lo.",
      });
      
      // Fechar o diálogo e limpar os dados
      setIsNewCondominiumDialogOpen(false);
      setNewCondominiumData({ name: "", address: "" });
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível sugerir o condomínio. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, suggestion: false }));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="state">Estado</Label>
        <Select 
          value={selectedState} 
          onValueChange={handleStateChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um estado" />
          </SelectTrigger>
          <SelectContent>
            {loading.states ? (
              <div className="flex justify-center p-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              states.map(state => (
                <SelectItem key={state.id} value={state.id}>
                  {state.name} ({state.uf})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
      
      {selectedState && (
        <div>
          <Label htmlFor="city">Cidade</Label>
          <Select 
            value={selectedCity} 
            onValueChange={handleCityChange}
            disabled={loading.cities}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma cidade" />
            </SelectTrigger>
            <SelectContent>
              {loading.cities ? (
                <div className="flex justify-center p-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                cities.map(city => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {selectedCity && (
        <div>
          <div className="flex justify-between items-center mb-1">
            <Label htmlFor="condominium">Condomínio</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              type="button"
              onClick={() => setIsNewCondominiumDialogOpen(true)}
              className="text-xs flex items-center px-2 h-8"
            >
              <PlusCircle className="h-3 w-3 mr-1" />
              Adicionar Novo
            </Button>
          </div>
          <Select 
            value={selectedCondominium} 
            onValueChange={handleCondominiumChange}
            disabled={loading.condominiums}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um condomínio" />
            </SelectTrigger>
            <SelectContent>
              {loading.condominiums ? (
                <div className="flex justify-center p-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : condominiums.length > 0 ? (
                condominiums.map(condo => (
                  <SelectItem key={condo.id} value={condo.id}>
                    {condo.name}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm text-gray-500">
                  Nenhum condomínio encontrado
                </div>
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Dialog para adicionar novo condomínio */}
      <Dialog 
        open={isNewCondominiumDialogOpen} 
        onOpenChange={setIsNewCondominiumDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sugerir Novo Condomínio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="condoName">Nome do Condomínio</Label>
              <Input
                id="condoName"
                placeholder="Ex: Edifício Solar das Flores"
                value={newCondominiumData.name}
                onChange={(e) => setNewCondominiumData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="condoAddress">Endereço (opcional)</Label>
              <Input
                id="condoAddress"
                placeholder="Ex: Av. Paulista, 1000"
                value={newCondominiumData.address}
                onChange={(e) => setNewCondominiumData(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter className="flex space-x-2 sm:space-x-0">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button 
              type="button" 
              onClick={handleAddNewCondominium}
              disabled={loading.suggestion}
            >
              {loading.suggestion && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sugerir Condomínio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LocationSelector;
