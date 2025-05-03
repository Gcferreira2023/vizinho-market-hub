
import { useState } from "react";
import { Check, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StatusBadge, { ListingStatus } from "./StatusBadge";

interface StatusSelectorProps {
  adId: string;
  currentStatus: ListingStatus;
  onStatusChange?: (newStatus: ListingStatus) => void;
  userId?: string;
  ownerId?: string;
}

const StatusSelector = ({ adId, currentStatus, onStatusChange, userId, ownerId }: StatusSelectorProps) => {
  const [status, setStatus] = useState<ListingStatus>(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
  // Verifica se o usuário atual é o dono do anúncio
  const isOwner = userId === ownerId;
  
  const handleStatusChange = async (newStatus: ListingStatus) => {
    if (newStatus === status) return;
    
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('ads')
        .update({ status: newStatus })
        .eq('id', adId);
        
      if (error) throw error;
      
      setStatus(newStatus);
      if (onStatusChange) onStatusChange(newStatus);
      
      toast({
        title: "Status atualizado",
        description: `O anúncio agora está ${newStatus}.`,
      });
    } catch (error: any) {
      console.error("Erro ao atualizar status:", error);
      toast({
        title: "Erro ao atualizar status",
        description: error.message || "Ocorreu um erro ao atualizar o status do anúncio.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Se não for o dono, apenas mostra o status
  if (!isOwner) {
    return <StatusBadge status={status} />;
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline"
          className="flex items-center gap-2" 
          disabled={isUpdating}
        >
          {isUpdating ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <StatusBadge status={status} />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          className={`flex items-center gap-2 ${status === "disponível" ? "bg-green-50" : ""}`}
          onClick={() => handleStatusChange("disponível")}
        >
          {status === "disponível" && <Check className="h-4 w-4 text-green-600" />}
          <StatusBadge status="disponível" />
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`flex items-center gap-2 ${status === "reservado" ? "bg-yellow-50" : ""}`}
          onClick={() => handleStatusChange("reservado")}
        >
          {status === "reservado" && <Check className="h-4 w-4 text-yellow-600" />}
          <StatusBadge status="reservado" />
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`flex items-center gap-2 ${status === "vendido" ? "bg-gray-50" : ""}`}
          onClick={() => handleStatusChange("vendido")}
        >
          {status === "vendido" && <Check className="h-4 w-4 text-gray-600" />}
          <StatusBadge status="vendido" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusSelector;
