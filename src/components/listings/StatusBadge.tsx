
import { Badge } from "@/components/ui/badge";

export type ListingStatus = "disponível" | "reservado" | "vendido";

interface StatusBadgeProps {
  status: ListingStatus;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusStyles = (): string => {
    switch (status) {
      case "disponível":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "reservado":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "vendido":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "";
    }
  };

  return (
    <Badge variant="outline" className={`${getStatusStyles()} ${className || ""}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default StatusBadge;
