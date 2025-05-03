import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/messages";

// Definimos um tipo intermediário "RawMessage" para representar os dados brutos vindos do banco de dados
interface RawMessage {
  id: string;
  content: string;
  created_at: string;
  read: boolean | null;  // Garantimos que `read` aceita valores nulos
  sender_id: string;
  receiver_id: string;
  ad_id: string; // Campo explicitamente obrigatório
}

export const fetchMessages = async (
  userId?: string,
  adId?: string,
  otherId?: string | null
): Promise<Message[]> => {
  // Retorna array vazio se os parâmetros obrigatórios não forem recebidos
  if (!userId || !adId || !otherId) return [];
  
  try {
    // Consulta ao Supabase
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("ad_id", adId)
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${userId})`
      )
      .order("created_at");

    // Lança o erro se ele existir
    if (error) throw error;

    // Conversão explícita dos dados para o tipo `Message`
    return (
      (data as RawMessage[]).map((msg) => ({
        id: msg.id,
        content: msg.content,
        created_at: msg.created_at,
        read: Boolean(msg.read), // Converte `null` para booleano
        sender_id: msg.sender_id,
        receiver_id: msg.receiver_id,
        ad_id: msg.ad_id,
      })) || []
    );
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return [];
  }
};
