
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/messages";

export type MessageHandler = (newMsg: Message) => void;

export const setupRealtimeChannel = (
  userId: string | undefined,
  adId: string | undefined,
  otherId: string | null | undefined,
  handleNewMessage: MessageHandler
): RealtimeChannel | null => {
  if (!userId || !adId || !otherId) return null;
  
  const channel = supabase
    .channel(`messages:${adId}:${otherId}`)
    .on(
      'postgres_changes',
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `ad_id=eq.${adId}`
      },
      (payload: any) => {
        handleNewMessage(payload.new as Message);
      }
    )
    .subscribe();
    
  return channel;
};
