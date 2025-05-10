
import { useState } from "react";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { StateSelect, CitySelect, CondominiumSelect } from "./location-filter";
import { useAuth } from "@/contexts/AuthContext";

interface LocationFilterProps {
  selectedStateId: string | null;
  setSelectedStateId: (stateId: string | null) => void;
  selectedCityId: string | null;
  setSelectedCityId: (cityId: string | null) => void;
  selectedCondominiumId: string | null;
  setSelectedCondominiumId: (condominiumId: string | null) => void;
}

const LocationFilter = ({
  selectedStateId,
  setSelectedStateId,
  selectedCityId,
  setSelectedCityId,
  selectedCondominiumId,
  setSelectedCondominiumId
}: LocationFilterProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useAuth();
  const isLoggedIn = !!user;
  
  // Check if any location filter is active
  const isLocationFilterActive = selectedStateId || selectedCityId || selectedCondominiumId;
  
  return (
    <div className="space-y-4 border-b pb-4">
      <div 
        className="flex items-center justify-between cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <MapPin 
            size={16} 
            className={isLocationFilterActive ? "mr-2 text-primary" : "mr-2 text-muted-foreground"} 
          />
          <h3 className={`font-medium ${isLocationFilterActive ? "text-primary" : ""}`}>
            Localização
            {isLocationFilterActive && <span className="text-xs ml-1 text-primary">• Ativo</span>}
          </h3>
        </div>
        {isOpen ? 
          <ChevronUp size={16} className="text-muted-foreground" /> : 
          <ChevronDown size={16} className="text-muted-foreground" />
        }
      </div>
      
      {isOpen && (
        <div className="space-y-4 pl-1">
          {/* State Select */}
          <StateSelect
            selectedStateId={selectedStateId}
            setSelectedStateId={setSelectedStateId}
          />
          
          {/* City Select - Only show if state is selected */}
          <CitySelect
            selectedStateId={selectedStateId}
            selectedCityId={selectedCityId}
            setSelectedCityId={setSelectedCityId}
          />
          
          {/* Condominium Select - Only show if city is selected */}
          <CondominiumSelect
            selectedCityId={selectedCityId}
            selectedCondominiumId={selectedCondominiumId}
            setSelectedCondominiumId={setSelectedCondominiumId}
            showAddNew={isLoggedIn}
          />
        </div>
      )}
    </div>
  );
};

export default LocationFilter;
