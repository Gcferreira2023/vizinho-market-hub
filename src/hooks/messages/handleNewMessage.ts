
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/messages";
import { Dispatch, SetStateAction } from "react";

export const createMessageHandler = (
  userId: string | undefined, 
  otherId: string | null | undefined,
  setMessages: Dispatch<SetStateAction<Message[]>>
) => {
  return (newMsg: Message) => {
    if (!userId || !otherId) return;
    
    // Verificar se a mensagem pertence a esta conversa
    const isRelevant = (
      (newMsg.sender_id === userId && newMsg.receiver_id === otherId) ||
      (newMsg.sender_id === otherId && newMsg.receiver_id === userId)
    );
    
    if (isRelevant) {
      // Usar uma abordagem mais segura para atualizar o estado
      setMessages(prev => [...prev, newMsg]);
      
      // Marcar como lida se o usuário atual é o destinatário
      if (newMsg.receiver_id === userId) {
        supabase
          .from('messages')
          .update({ read: true })
          .eq('id', newMsg.id);
      }
    }
  };
};
