
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Message, AdInfo, UserInfo } from "@/types/messages";

export const useConversationMessages = (adId?: string, otherId?: string | null) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adInfo, setAdInfo] = useState<AdInfo | null>(null);
  const [otherUser, setOtherUser] = useState<UserInfo | null>(null);

  // Função para buscar informações do anúncio
  const fetchAdInfo = useCallback(async () => {
    if (!adId) return null;
    
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('id, title, user_id')
        .eq('id', adId)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao buscar informações do anúncio:", error);
      return null;
    }
  }, [adId]);

  // Função para buscar informações do outro usuário
  const fetchUserInfo = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .auth.admin.getUserById(userId);
        
      if (error) throw error;
      
      return {
        id: data.user.id,
        name: data.user.user_metadata?.full_name || "Usuário",
      };
    } catch (error) {
      console.error("Erro ao buscar informações do usuário:", error);
      return null;
    }
  }, []);

  // Função para buscar mensagens da conversa
  const fetchMessages = useCallback(async () => {
    if (!user?.id || !adId || !otherId) return [] as Message[];
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('ad_id', adId)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${user.id})`)
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
  }, [user, adId, otherId]);

  // Função para marcar mensagens como lidas
  const markMessagesAsRead = useCallback(async (messagesToMark: Message[]) => {
    if (!user?.id || messagesToMark.length === 0) return;
    
    const unreadMessages = messagesToMark.filter(
      msg => msg.receiver_id === user.id && !msg.read
    );
    
    if (unreadMessages.length === 0) return;
    
    try {
      await supabase
        .from('messages')
        .update({ read: true }) // Using read instead of is_read
        .in('id', unreadMessages.map(msg => msg.id));
    } catch (error) {
      console.error("Erro ao marcar mensagens como lidas:", error);
    }
  }, [user]);

  // Função para configurar o canal de realtime
  const setupRealtimeChannel = useCallback(() => {
    if (!user?.id || !adId || !otherId) return null;
    
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
  }, [user, adId, otherId]);

  // Função para lidar com novas mensagens recebidas via realtime
  const handleNewMessage = useCallback((newMsg: Message) => {
    if (!user?.id || !otherId) return;
    
    // Verificar se a mensagem pertence a esta conversa
    const isRelevant = (
      (newMsg.sender_id === user.id && newMsg.receiver_id === otherId) ||
      (newMsg.sender_id === otherId && newMsg.receiver_id === user.id)
    );
    
    if (isRelevant) {
      setMessages(prev => [...prev, newMsg]);
      
      // Marcar como lida se o usuário atual é o destinatário
      if (newMsg.receiver_id === user.id) {
        supabase
          .from('messages')
          .update({ read: true }) // Using read instead of is_read
          .eq('id', newMsg.id);
      }
    }
  }, [user, otherId]);

  // Efeito principal para carregar dados
  useEffect(() => {
    const loadConversationData = async () => {
      if (!user || !adId || !otherId) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Carregar dados em paralelo
        const [adData, userData, messagesData] = await Promise.all([
          fetchAdInfo(),
          fetchUserInfo(otherId),
          fetchMessages()
        ]);
        
        if (adData) setAdInfo(adData);
        if (userData) setOtherUser(userData);
        if (messagesData.length) {
          setMessages(messagesData);
          await markMessagesAsRead(messagesData);
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
    
    // Configurar canal de realtime
    const channel = setupRealtimeChannel();
    
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [user, adId, otherId, toast, fetchAdInfo, fetchUserInfo, fetchMessages, markMessagesAsRead, setupRealtimeChannel]);
  
  // Função para enviar mensagens
  const sendMessage = async (content: string) => {
    if (!content.trim() || !user || !adId || !otherId) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content: content.trim(),
          sender_id: user.id,
          receiver_id: otherId,
          ad_id: adId,
          read: false, // Using read instead of is_read
        });
        
      if (error) throw error;
      
    } catch (error: any) {
      console.error("Erro ao enviar mensagem:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua mensagem",
        variant: "destructive"
      });
      throw error;
    }
  };

  return { 
    messages, 
    isLoading, 
    adInfo, 
    otherUser, 
    sendMessage 
  };
};
