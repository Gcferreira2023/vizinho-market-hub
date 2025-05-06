
import { useState } from "react";
import { Eye, Clock, ChartBar, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ListingMetricsProps {
  viewCount: number;
  messageCount?: number;
  createdAt: string;
  condensed?: boolean;
  className?: string; // Added className prop
  showChart?: boolean; // Added showChart prop
}

const ListingMetrics = ({
  viewCount,
  messageCount = 0,
  createdAt,
  condensed = false,
  className = '',
  showChart = false
}: ListingMetricsProps) => {
  const [showFullDate, setShowFullDate] = useState(false);
  
  // Format date in a more readable way
  const formattedDate = format(new Date(createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  
  // Get relative time (e.g., "3 days ago")
  const relativeTime = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: ptBR
  });
  
  if (condensed) {
    return (
      <div className={`flex items-center justify-between text-sm text-gray-500 ${className}`}>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Eye size={16} className="mr-1" />
            <span>{viewCount}</span>
          </div>
          
          {messageCount > 0 && (
            <div className="flex items-center">
              <MessageSquare size={16} className="mr-1" />
              <span>{messageCount}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center">
          <Clock size={16} className="mr-1" />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help">{relativeTime}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{formattedDate}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="font-medium text-sm flex items-center">
        <ChartBar size={16} className="mr-2 text-primary" />
        Métricas
      </h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-500">Visualizações</div>
          <div className="text-2xl font-bold flex items-center gap-1">
            <Eye size={18} className="text-primary" />
            {viewCount}
          </div>
        </div>
        
        {messageCount > 0 && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Mensagens</div>
            <div className="text-2xl font-bold flex items-center gap-1">
              <MessageSquare size={18} className="text-primary" />
              {messageCount}
            </div>
          </div>
        )}
      </div>
      
      {showChart && (
        <div className="mt-2 pt-3 border-t">
          <h5 className="text-sm text-gray-500 mb-2">Desempenho do anúncio</h5>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${Math.min(100, viewCount ? (viewCount / 20) * 100 : 5)}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>Desempenho</span>
            <span>{Math.min(100, viewCount ? Math.round((viewCount / 20) * 100) : 5)}%</span>
          </div>
        </div>
      )}
      
      <div className="pt-2 text-sm text-gray-500 flex items-center">
        <Clock size={16} className="mr-2" />
        Publicado: {showFullDate ? formattedDate : relativeTime}
        <Button 
          variant="link" 
          size="sm" 
          className="text-xs p-0 h-auto ml-1"
          onClick={() => setShowFullDate(!showFullDate)}
        >
          {showFullDate ? "mostrar relativo" : "mostrar data completa"}
        </Button>
      </div>
    </div>
  );
};

export default ListingMetrics;
