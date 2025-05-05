
import { MapPin } from "lucide-react";
import { StateSelect, CitySelect, CondominiumSelect } from "./location-filter";

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
  return (
    <div className="space-y-4">
      <div className="flex items-center mb-2">
        <MapPin size={16} className="mr-2 text-primary" />
        <h3 className="font-medium">Localização</h3>
      </div>
      
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
      />
    </div>
  );
};

export default LocationFilter;
