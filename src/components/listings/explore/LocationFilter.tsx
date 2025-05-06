
import { useState } from "react";
import { MapPin } from "lucide-react";
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
  
  return (
    <div className="space-y-4 border-b pb-4">
      <div 
        className="flex items-center justify-between cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <MapPin size={16} className="mr-2 text-primary" />
          <h3 className="font-medium">Localização</h3>
        </div>
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
