import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/messages";

// Defina um tipo intermediário para os dados que vêm do Supabase
// Isso evita o problema de tipo excessivamente profundo
interface RawMessage {
  id: string;
  content: string;
  created_at: string;
  read: boolean | null; // Usando null para cobrir possíveis valores nulos do banco
  sender_id: string;
  receiver_id: string;
  ad_id: string;
}

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
    
    // Converter dados brutos para o tipo Message usando o tipo intermediário
    // Isso previne a recursão de tipos e o erro "excessivamente profundo"
    return (data as RawMessage[] || []).map(msg => ({
      id: msg.id,
      content: msg.content,
      created_at: msg.created_at,
      read: Boolean(msg.read),
      sender_id: msg.sender_id,
      receiver_id: msg.receiver_id,
      ad_id: msg.ad_id
    }));
    
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return [];
  }
};
