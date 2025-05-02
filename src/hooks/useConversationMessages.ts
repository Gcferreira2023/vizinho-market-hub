
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  sender_id: string;
  receiver_id: string;
}

interface AdInfo {
  id: string;
  title: string;
  user_id: string;
}

interface UserInfo {
  id: string;
  name: string;
}

export const useConversationMessages = (adId?: string, otherId?: string | null) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adInfo, setAdInfo] = useState<AdInfo | null>(null);
  const [otherUser, setOtherUser] = useState<UserInfo | null>(null);
  
  // Buscar dados do anúncio, usuário e mensagens
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !adId || !otherId) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Buscar informações do anúncio
        const { data: adData, error: adError } = await supabase
          .from('ads')
          .select('id, title, user_id')
          .eq('id', adId)
          .single();
          
        if (adError) throw adError;
        
        setAdInfo(adData);
        
        // Buscar informações do outro usuário
        const { data: userData, error: userError } = await supabase
          .auth.admin.getUserById(otherId);
          
        if (userError) throw userError;
        
        setOtherUser({
          id: userData.user.id,
          name: userData.user.user_metadata?.full_name || "Usuário",
        });
        
        // Buscar mensagens entre os usuários para este anúncio
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('ad_id', adId)
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${user.id})`)
          .order('created_at');
          
        if (messagesError) throw messagesError;
        
        setMessages(messagesData || []);
        
        // Marcar mensagens como lidas
        if (messagesData && messagesData.length > 0) {
          const unreadMessages = messagesData.filter(
            msg => msg.receiver_id === user.id && !msg.is_read
          );
          
          if (unreadMessages.length > 0) {
            await supabase
              .from('messages')
              .update({ is_read: true })
              .in('id', unreadMessages.map(msg => msg.id));
          }
        }
      } catch (error: any) {
        console.error("Erro ao carregar dados:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a conversa",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Configurar subscription para notificações em tempo real
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
          // Adicionar nova mensagem à lista
          const newMsg = payload.new as Message;
          
          // Verificar se a mensagem pertence a esta conversa
          const isRelevant = (
            (newMsg.sender_id === user?.id && newMsg.receiver_id === otherId) ||
            (newMsg.sender_id === otherId && newMsg.receiver_id === user?.id)
          );
          
          if (isRelevant) {
            setMessages(prev => [...prev, newMsg]);
            
            // Marcar como lida se o usuário atual é o destinatário
            if (newMsg.receiver_id === user?.id) {
              supabase
                .from('messages')
                .update({ is_read: true })
                .eq('id', newMsg.id);
            }
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, adId, otherId, toast]);
  
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
          is_read: false,
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
