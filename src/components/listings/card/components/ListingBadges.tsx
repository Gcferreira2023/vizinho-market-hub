
import React from "react";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { ListingStatus } from "@/components/listings/StatusBadge";

interface TypeBadgeProps {
  type: "produto" | "serviço";
}

export const TypeBadge = ({ type }: TypeBadgeProps) => (
  <Badge
    className="absolute top-2 left-2 z-10"
    variant={type === "produto" ? "default" : "secondary"}
  >
    {type}
  </Badge>
);

interface CategoryAndStatusBadgesProps {
  category: string;
  status: string;
}

export const CategoryAndStatusBadges = ({ category, status }: CategoryAndStatusBadgesProps) => (
  <div className="absolute top-2 right-2 flex flex-col gap-2 items-end z-10">
    <Badge 
      variant="outline" 
      className="bg-white/80 backdrop-blur-sm text-gray-800"
    >
      {category}
    </Badge>
    <StatusBadge status={status} />
  </div>
);

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <Badge 
    variant="outline" 
    className={`bg-white/80 backdrop-blur-sm ${
      status === "disponível" ? "text-green-700" :
      status === "reservado" ? "text-amber-700" :
      "text-gray-700"
    }`}
  >
    {status}
  </Badge>
);

interface CondominiumBadgeProps {
  condominiumName?: string;
  isUserCondominium?: boolean;
}

export const CondominiumBadge = ({ condominiumName, isUserCondominium = false }: CondominiumBadgeProps) => {
  if (!condominiumName) return null;
  
  return (
    <div className="absolute bottom-2 left-2 z-10">
      <Badge 
        variant="outline" 
        className={`text-xs py-1 px-2 flex items-center gap-1 
          ${isUserCondominium 
            ? 'bg-primary/20 text-primary border-primary/30' 
            : 'bg-white/80 text-gray-700 border-gray-300'}`}
      >
        <MapPin className="h-3 w-3" />
        {condominiumName}
        {isUserCondominium && (
          <span className="bg-primary/20 text-primary text-[10px] px-1 rounded ml-1">Seu</span>
        )}
      </Badge>
    </div>
  );
};

interface MockIndicatorProps {
  isMockListing: boolean;
}

export const MockIndicator = ({ isMockListing }: MockIndicatorProps) => {
  if (!isMockListing) return null;
  
  return (
    <Badge 
      variant="outline" 
      className="absolute top-2 left-20 z-10 bg-amber-100 text-amber-800 border-amber-200"
    >
      Ilustrativo
    </Badge>
  );
};
