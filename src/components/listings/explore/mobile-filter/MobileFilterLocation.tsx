
import { useState } from "react";
import { MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { StateSelect, CitySelect, CondominiumSelect } from "../location-filter";

interface MobileFilterLocationProps {
  selectedStateId: string | null;
  setSelectedStateId: (stateId: string | null) => void;
  selectedCityId: string | null;
  setSelectedCityId: (cityId: string | null) => void;
  selectedCondominiumId: string | null;
  setSelectedCondominiumId: (condominiumId: string | null) => void;
}

const MobileFilterLocation = ({
  selectedStateId,
  setSelectedStateId,
  selectedCityId,
  setSelectedCityId,
  selectedCondominiumId,
  setSelectedCondominiumId
}: MobileFilterLocationProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="space-y-4 border-b pb-4">
      <div 
        className="flex items-center justify-between cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <MapPin size={18} className="mr-2 text-primary" />
          <Label className="font-medium text-base cursor-pointer">Localização</Label>
        </div>
      </div>
      
      {isOpen && (
        <div className="space-y-4 mt-2 pl-2">
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
      )}
    </div>
  );
};

export default MobileFilterLocation;
