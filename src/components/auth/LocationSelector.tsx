
import { LocationSelector as LocationSelectorComponent } from "@/components/location";
import { LocationFormData } from "@/types/location";

interface LocationSelectorProps {
  onLocationSelected: (location: LocationFormData) => void;
  initialValues?: {
    stateId?: string;
    cityId?: string;
    condominiumId?: string;
  };
}

const LocationSelector = ({ onLocationSelected, initialValues = {} }: LocationSelectorProps) => {
  return <LocationSelectorComponent onLocationSelected={onLocationSelected} initialValues={initialValues} />;
};

export default LocationSelector;
