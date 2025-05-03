
import { useAuth } from "@/contexts/AuthContext";
import { useConversationData } from "./messages/useConversationData";
import { Message } from "../types/messages"; // Importe a interface centralizada

export const useConversationMessages = (adId?: string, otherId?: string | null) => {
  const { user } = useAuth();
  
  return useConversationData(user?.id, adId, otherId);
};
