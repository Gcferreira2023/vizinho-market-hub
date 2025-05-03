
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/messages";

export const fetchMessages = async (
  userId?: string,
  adId?: string,
  otherId?: string | null
): Promise<Message[]> => {
  if (!userId || !adId || !otherId) return [] as Message[];
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('ad_id', adId)
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${userId})`)
      .order('created_at');
      
    if (error) throw error;
    
    // Ensure proper type conversion
    const typedMessages = (data || []).map(msg => ({
      ...msg,
      read: !!msg.read // Ensure consistent field name
    })) as Message[];
    
    return typedMessages;
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return [] as Message[];
  }
};
