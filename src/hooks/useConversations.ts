
import { useState, useEffect } from "react";
import { supabase } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

// Define proper interfaces for the data structure
interface AdInfo {
  id: string;
  title: string;
}

interface UserMetadata {
  full_name?: string;
}

interface UserProfile {
  id: string;
  user_metadata: UserMetadata;
}

interface MessageData {
  id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  sender_id: string;
  receiver_id: string;
  ad_id: string;
  ads: AdInfo;
  profiles_sender: UserProfile;
  profiles_receiver: UserProfile;
}

interface Conversation {
  id: string;
  lastMessage: string;
  lastMessageDate: string;
  unread: boolean;
  otherUser: {
    id: string;
    name: string;
  };
  ad: {
    id: string;
    title: string;
  };
}

export const useConversations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = async () => {
    if (!user) return;
    
    try {
      // Buscar conversas onde o usuário participa
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          is_read,
          sender_id,
          receiver_id,
          ad_id,
          ads:ad_id (
            id,
            title
          ),
          profiles_sender:sender_id (
            id,
            user_metadata
          ),
          profiles_receiver:receiver_id (
            id,
            user_metadata
          )
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Processar os dados para agrupar por conversa
      const conversationsMap = new Map();
      
      if (data) {
        data.forEach((message: any) => {
          // Determinar o ID do outro usuário
          const otherUserId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
          const otherUserProfile = message.sender_id === user.id 
            ? message.profiles_receiver
            : message.profiles_sender;
          
          // Criar chave única para a conversa
          const conversationKey = `${otherUserId}-${message.ad_id}`;
          
          if (!conversationsMap.has(conversationKey)) {
            conversationsMap.set(conversationKey, {
              id: conversationKey,
              lastMessage: message.content,
              lastMessageDate: message.created_at,
              unread: message.receiver_id === user.id && !message.is_read,
              otherUser: {
                id: otherUserId,
                name: otherUserProfile.user_metadata?.full_name || "Usuário",
              },
              ad: {
                id: message.ads.id,
                title: message.ads.title,
              }
            });
          }
        });
      }
      
      // Converter mapa em array e ordenar por data da última mensagem
      const conversationsArray = Array.from(conversationsMap.values())
        .sort((a, b) => new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime());
      
      setConversations(conversationsArray);
    } catch (error: any) {
      console.error("Erro ao carregar conversas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas conversas",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    
    // Configurar subscription para notificações em tempo real
    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `receiver_id=eq.${user?.id}`
        },
        (payload) => {
          // Recarregar conversas quando uma nova mensagem for recebida
          fetchConversations();
          
          // Notificar o usuário
          toast({
            title: "Nova mensagem",
            description: "Você recebeu uma nova mensagem"
          });
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  return { conversations, isLoading, fetchConversations };
};
