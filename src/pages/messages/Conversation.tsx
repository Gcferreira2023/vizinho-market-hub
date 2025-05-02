
import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Send, User } from "lucide-react";
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

const Conversation = () => {
  const { id: adId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const otherId = searchParams.get('user');
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [adInfo, setAdInfo] = useState<any>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Buscar dados do anúncio, usuário e mensagens
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !adId || !otherId) return;
      
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
  
  // Rolar para o final da conversa quando houver novas mensagens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user || !adId || !otherId) return;
    
    setIsSending(true);
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content: newMessage.trim(),
          sender_id: user.id,
          receiver_id: otherId,
          ad_id: adId,
          is_read: false,
        });
        
      if (error) throw error;
      
      // Limpar campo após envio
      setNewMessage("");
      
    } catch (error: any) {
      console.error("Erro ao enviar mensagem:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua mensagem",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <Card className="flex flex-col h-[calc(100vh-200px)]">
          <CardHeader className="border-b pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" asChild className="mr-2">
                  <Link to="/mensagens">
                    <ArrowLeft size={18} />
                  </Link>
                </Button>
                
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <User size={16} className="text-primary" />
                  </div>
                  
                  <div>
                    <h2 className="font-medium">
                      {otherUser?.name || "Carregando..."}
                    </h2>
                    {adInfo && (
                      <p className="text-xs text-gray-500">
                        Sobre: {adInfo.title}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {adInfo && (
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/anuncio/${adInfo.id}`}>Ver anúncio</Link>
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto py-4 px-2">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <p>Carregando mensagens...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-full text-center">
                <p className="text-gray-500">Nenhuma mensagem ainda.</p>
                <p className="text-gray-500">Envie uma mensagem para iniciar a conversa.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.sender_id === user?.id 
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p 
                        className={`text-xs ${
                          message.sender_id === user?.id 
                            ? 'text-primary-foreground/70' 
                            : 'text-gray-500'
                        } mt-1`}
                      >
                        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </CardContent>
          
          <CardFooter className="border-t pt-3">
            <form onSubmit={sendMessage} className="w-full flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={isSending || isLoading}
              />
              <Button 
                type="submit" 
                disabled={!newMessage.trim() || isSending || isLoading}
              >
                <Send size={18} className="mr-2" />
                Enviar
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Conversation;
