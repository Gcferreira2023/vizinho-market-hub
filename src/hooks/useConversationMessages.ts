
import { useAuth } from "@/contexts/AuthContext";
import { useConversationData } from "./messages/useConversationData";

export const useConversationMessages = (adId?: string, otherId?: string | null) => {
  const { user } = useAuth();
  
  return useConversationData(user?.id, adId, otherId);
};
