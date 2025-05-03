
import { supabase } from "@/integrations/supabase/client";

export const createSendMessageFunction = (
  userId: string | undefined,
  adId: string | undefined,
  otherId: string | null | undefined
) => {
  return async (content: string) => {
    if (!content.trim() || !userId || !adId || !otherId) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content: content.trim(),
          sender_id: userId,
          receiver_id: otherId,
          ad_id: adId,
          read: false,
        });
        
      if (error) throw error;
      
    } catch (error: any) {
      console.error("Erro ao enviar mensagem:", error);
      throw error;
    }
  };
};
