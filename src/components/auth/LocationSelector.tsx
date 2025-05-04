
import { LocationSelector as LocationSelectorComponent } from "@/components/location";

const LocationSelector = ({ onLocationSelected, initialValues }) => {
  return <LocationSelectorComponent onLocationSelected={onLocationSelected} initialValues={initialValues} />;
};

export default LocationSelector;
