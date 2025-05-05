
import { MapPin } from "lucide-react";
import { StateSelect, CitySelect, CondominiumSelect } from "./location-filter";

interface MobileLocationFilterProps {
  selectedStateId: string | null;
  setSelectedStateId: (stateId: string | null) => void;
  selectedCityId: string | null;
  setSelectedCityId: (cityId: string | null) => void;
  selectedCondominiumId: string | null;
  setSelectedCondominiumId: (condominiumId: string | null) => void;
}

const MobileLocationFilter = ({
  selectedStateId,
  setSelectedStateId,
  selectedCityId,
  setSelectedCityId,
  selectedCondominiumId,
  setSelectedCondominiumId
}: MobileLocationFilterProps) => {
  return (
    <div className="space-y-5 mt-4">
      <div className="flex items-center mb-1">
        <MapPin size={18} className="mr-2 text-primary" />
        <h3 className="font-medium">Localização</h3>
      </div>
      
      {/* State Select */}
      <StateSelect
        selectedStateId={selectedStateId}
        setSelectedStateId={setSelectedStateId}
      />
      
      {/* City Select */}
      <CitySelect
        selectedStateId={selectedStateId}
        selectedCityId={selectedCityId}
        setSelectedCityId={setSelectedCityId}
      />
      
      {/* Condominium Select */}
      <CondominiumSelect
        selectedCityId={selectedCityId}
        selectedCondominiumId={selectedCondominiumId}
        setSelectedCondominiumId={setSelectedCondominiumId}
      />
    </div>
  );
};

export default MobileLocationFilter;
