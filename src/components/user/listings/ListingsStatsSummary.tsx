
import { BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ListingsStatsSummaryProps {
  totalListings: number;
  totalViews: number;
}

const ListingsStatsSummary = ({ totalListings, totalViews }: ListingsStatsSummaryProps) => {
  return (
    <div className="bg-primary/5 border border-primary/10 p-4 rounded-lg mb-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="text-center md:text-left">
            <span className="text-sm text-gray-500">Total de anúncios</span>
            <h3 className="text-2xl font-bold">{totalListings}</h3>
          </div>
          <div className="text-center md:text-left">
            <span className="text-sm text-gray-500">Total de visualizações</span>
            <h3 className="text-2xl font-bold">{totalViews}</h3>
          </div>
        </div>
        <div className="flex items-center justify-center md:justify-end">
          <Button variant="outline" size="sm" className="gap-2">
            <BarChart2 size={16} />
            <span>Estatísticas detalhadas</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ListingsStatsSummary;
