
import { Card } from "@/components/ui/card";
import { Eye, Clock, MessageSquare } from "lucide-react";

interface SimpleStatsProps {
  viewCount: number;
  daysActive: number;
  contactClicks?: number;
}

const SimpleStats = ({ viewCount, daysActive, contactClicks = 0 }: SimpleStatsProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-base font-medium mb-2">Estatísticas do anúncio</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <Eye size={24} className="mb-2 text-gray-600" />
          <span className="text-2xl font-bold">{viewCount}</span>
          <span className="text-sm text-gray-500">visualizações</span>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <Clock size={24} className="mb-2 text-gray-600" />
          <span className="text-2xl font-bold">{daysActive}</span>
          <span className="text-sm text-gray-500">dias ativos</span>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <MessageSquare size={24} className="mb-2 text-gray-600" />
          <span className="text-2xl font-bold">{contactClicks}</span>
          <span className="text-sm text-gray-500">contatos</span>
        </Card>
      </div>
    </div>
  );
};

export default SimpleStats;
