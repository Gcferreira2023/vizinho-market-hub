
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { CalendarDays, Eye } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

interface ListingMetricsProps {
  viewCount?: number;
  createdAt?: string;
  className?: string;
  showChart?: boolean;
  condensed?: boolean;
}

const ListingMetrics = ({ 
  viewCount = 0, 
  createdAt, 
  className,
  showChart = false,
  condensed = false
}: ListingMetricsProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Calcular dias ativos
  const daysActive = createdAt 
    ? differenceInDays(new Date(), new Date(createdAt)) 
    : 0;
  
  // Média de visualizações por dia (evitar divisão por zero)
  const viewsPerDay = daysActive > 0 
    ? (viewCount / daysActive).toFixed(1) 
    : viewCount;
  
  useEffect(() => {
    if (showChart) {
      // Para demonstração, gera dados simulados de visualizações dos últimos 7 dias
      // Em uma implementação real, estes dados viriam do banco de dados
      const mockData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        
        // Gerar um número aleatório ponderado pela quantidade total de visualizações
        // para criar uma distribuição mais realista
        const weight = Math.max(1, viewCount / 10);
        const dailyViews = Math.floor(Math.random() * weight) + (viewCount > 20 ? 2 : 1);
        
        return {
          day: format(date, 'dd/MM'),
          views: dailyViews,
        };
      });
      
      setChartData(mockData);
    }
  }, [viewCount, showChart]);
  
  if (condensed) {
    return (
      <div className={cn("flex items-center gap-1 text-sm text-gray-600", className)}>
        <Eye size={16} className="text-gray-500" />
        <span>{viewCount}</span>
      </div>
    );
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border bg-card p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-medium">Total de visualizações</h4>
          </div>
          <p className="mt-2 text-2xl font-bold">{viewCount}</p>
          <p className="text-xs text-muted-foreground">
            Média de {viewsPerDay} por dia
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-medium">Tempo ativo</h4>
          </div>
          <p className="mt-2 text-2xl font-bold">{daysActive} {daysActive === 1 ? 'dia' : 'dias'}</p>
          <p className="text-xs text-muted-foreground">
            Desde {createdAt ? format(new Date(createdAt), 'dd/MM/yyyy') : '-'}
          </p>
        </div>
      </div>
      
      {showChart && chartData.length > 0 && (
        <div className="rounded-lg border bg-card p-3 shadow-sm">
          <h4 className="mb-2 text-sm font-medium">Visualizações nos últimos 7 dias</h4>
          <ChartContainer className="h-40" config={{ views: { theme: { light: '#9b87f5', dark: '#9b87f5' } } }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 10 }}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tickMargin={5}
                  fontSize={12}
                  stroke="#888"
                />
                <Tooltip content={<ChartTooltipContent labelKey="day" />} />
                <Bar 
                  dataKey="views" 
                  name="views"
                  fill="var(--color-views)" 
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      )}
    </div>
  );
};

export default ListingMetrics;
