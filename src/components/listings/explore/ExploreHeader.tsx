
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingStatus } from "@/components/listings/StatusBadge";

interface ExploreHeaderProps {
  title?: string;
  onFilterButtonClick: () => void;
}

// This component is simplified and no longer used in the main ExploreListings page
// It's kept for reference or potential future use
const ExploreHeader = ({
  title = "Explorar Anúncios",
  onFilterButtonClick
}: ExploreHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      
      <Button 
        variant="outline" 
        className="flex items-center gap-2 md:hidden"
        onClick={onFilterButtonClick}
      >
        <Filter size={16} />
        Filtros
      </Button>
    </div>
  );
};

export default ExploreHeader;
