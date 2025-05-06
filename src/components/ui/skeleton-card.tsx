
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useMobile } from "@/hooks/useMobile";

export const SkeletonCard = ({ variant = "default" }: { variant?: "default" | "compact" | "detail" }) => {
  const isMobile = useMobile();
  
  // Ajustar altura baseado em dispositivo móvel
  const imageHeight = isMobile ? "h-28" : "h-36";
  const defaultImageHeight = isMobile ? "h-40" : "h-48";
  
  if (variant === "compact") {
    return (
      <Card className="overflow-hidden h-full flex flex-col animate-pulse">
        <div className={`relative ${imageHeight} bg-muted`}>
          <Skeleton className="h-full w-full" />
        </div>
        
        <div className="p-3 flex flex-col flex-grow">
          <Skeleton className="h-4 w-3/4 mb-1" />
          <Skeleton className="h-3 w-1/2 mb-2" />
          
          <div className="mt-auto">
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </Card>
    );
  }
  
  if (variant === "detail") {
    return (
      <div className="space-y-4">
        <Skeleton className={`${isMobile ? "h-56" : "h-72"} w-full rounded-lg`} />
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className={`${isMobile ? "h-20" : "h-24"} w-full mt-4`} />
        </div>
      </div>
    );
  }
  
  // Default variant
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className={`relative ${defaultImageHeight} bg-muted`}>
        <Skeleton className="h-full w-full" />
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        
        <div className="mt-auto">
          <div className="flex items-center mb-2">
            <Skeleton className="h-4 w-4 rounded-full mr-2" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SkeletonCard;
