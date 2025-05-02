
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

// Define proper interfaces for the data structure
interface AdInfo {
  id: string;
  title: string;
}

interface UserProfile {
  id: string;
  user_metadata: {
    full_name?: string;
  };
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

const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
        
        data?.forEach((message: MessageData) => {
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mensagens</h1>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <p>Carregando suas conversas...</p>
          </div>
        ) : conversations.length > 0 ? (
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <Link to={`/conversa/${conversation.ad.id}?user=${conversation.otherUser.id}`} key={conversation.id}>
                <Card className={`p-4 hover:bg-gray-50 transition-colors ${
                  conversation.unread ? 'border-l-4 border-l-primary' : ''
                }`}>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User size={20} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium truncate">
                          {conversation.otherUser.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {new Date(conversation.lastMessageDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 truncate">
                        {conversation.lastMessage}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        Anúncio: {conversation.ad.title}
                      </p>
                    </div>
                    {conversation.unread && (
                      <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium mb-2">Sem mensagens</h2>
            <p className="text-gray-500 mb-6">
              Você ainda não tem nenhuma conversa ativa.
            </p>
            <Button asChild>
              <Link to="/">Explorar anúncios</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Messages;
