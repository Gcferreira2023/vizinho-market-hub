
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/messages";

export const fetchMessages = async (
  userId?: string,
  adId?: string,
  otherId?: string | null
): Promise<Message[]> => {
  if (!userId || !adId || !otherId) return [];
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('ad_id', adId)
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${userId})`)
      .order('created_at');
      
    if (error) throw error;
    
    // Simplificando o retorno para evitar problemas de tipo profundo
    return (data || []).map(msg => ({
      id: msg.id,
      content: msg.content,
      created_at: msg.created_at,
      read: !!msg.read, // Garantir tipo booleano
      sender_id: msg.sender_id,
      receiver_id: msg.receiver_id,
      ad_id: msg.ad_id
    })) as Message[];
    
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return [];
  }
};
