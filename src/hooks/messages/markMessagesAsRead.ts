
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/messages";

export const markMessagesAsRead = async (
  userId: string | undefined, 
  messagesToMark: Message[]
): Promise<void> => {
  if (!userId || messagesToMark.length === 0) return;
  
  const unreadMessages = messagesToMark.filter(
    msg => msg.receiver_id === userId && !msg.read
  );
  
  if (unreadMessages.length === 0) return;
  
  try {
    await supabase
      .from('messages')
      .update({ read: true })
      .in('id', unreadMessages.map(msg => msg.id));
  } catch (error) {
    console.error("Erro ao marcar mensagens como lidas:", error);
  }
};
