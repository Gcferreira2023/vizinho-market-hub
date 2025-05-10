
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExploreHeaderProps {
  isMobile: boolean;
  setIsFilterSheetOpen: (open: boolean) => void;
}

const ExploreHeader = ({ isMobile, setIsFilterSheetOpen }: ExploreHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Explorar Anúncios</h1>
      
      {/* Mobile Filter Button - Only displayed on mobile */}
      {isMobile && (
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setIsFilterSheetOpen(true)}
        >
          <Filter size={16} />
          Filtros
        </Button>
      )}
    </div>
  );
};

export default ExploreHeader;
