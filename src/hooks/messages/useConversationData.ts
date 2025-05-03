
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Message, AdInfo, UserInfo } from "@/types/messages";

import { fetchAdInfo } from "./fetchAdInfo";
import { fetchUserInfo } from "./fetchUserInfo";
import { fetchMessages } from "./fetchMessages";
import { markMessagesAsRead } from "./markMessagesAsRead";
import { setupRealtimeChannel } from "./setupRealtimeChannel";
import { createMessageHandler } from "./handleNewMessage";
import { createSendMessageFunction } from "./sendMessage";

export const useConversationData = (
  userId: string | undefined, 
  adId?: string, 
  otherId?: string | null
) => {
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adInfo, setAdInfo] = useState<AdInfo | null>(null);
  const [otherUser, setOtherUser] = useState<UserInfo | null>(null);
  
  // Create message handling functions with closure over state
  const handleNewMessage = createMessageHandler(userId, otherId, setMessages);
  const sendMessage = createSendMessageFunction(userId, adId, otherId);

  // Load conversation data
  useEffect(() => {
    const loadConversationData = async () => {
      if (!userId || !adId || !otherId) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Carregar dados em paralelo
        const [adData, userData, messagesData] = await Promise.all([
          fetchAdInfo(adId),
          fetchUserInfo(otherId),
          fetchMessages(userId, adId, otherId)
        ]);
        
        if (adData) setAdInfo(adData);
        if (userData) setOtherUser(userData);
        if (messagesData.length) {
          setMessages(messagesData);
          await markMessagesAsRead(userId, messagesData);
        }
      } catch (error: any) {
        console.error("Erro ao carregar dados da conversa:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a conversa",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConversationData();
    
    // Setup realtime channel
    const channel = setupRealtimeChannel(userId, adId, otherId, handleNewMessage);
    
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [userId, adId, otherId, toast]);

  return { 
    messages, 
    isLoading, 
    adInfo, 
    otherUser, 
    sendMessage 
  };
};
