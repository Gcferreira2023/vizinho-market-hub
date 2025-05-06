
import { Eye, ChartBar } from "lucide-react";

interface ListingsStatsSummaryProps {
  totalListings: number;
  totalViews: number;
}

const ListingsStatsSummary = ({ totalListings, totalViews }: ListingsStatsSummaryProps) => {
  // Calcular média de visualizações por anúncio
  const avgViewsPerListing = totalListings > 0 
    ? Math.round(totalViews / totalListings) 
    : 0;
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-primary/5 rounded-lg p-4 flex items-center">
        <div className="rounded-full bg-primary/10 p-3 mr-4">
          <ChartBar className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-gray-600">Total de anúncios</p>
          <p className="text-2xl font-bold">{totalListings}</p>
        </div>
      </div>
      
      <div className="bg-primary/5 rounded-lg p-4 flex items-center">
        <div className="rounded-full bg-primary/10 p-3 mr-4">
          <Eye className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-gray-600">Total de visualizações</p>
          <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="bg-primary/5 rounded-lg p-4 flex items-center">
        <div className="rounded-full bg-primary/10 p-3 mr-4">
          <Eye className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-gray-600">Média por anúncio</p>
          <p className="text-2xl font-bold">{avgViewsPerListing}</p>
        </div>
      </div>
    </div>
  );
};

export default ListingsStatsSummary;
