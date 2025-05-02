
import { useParams, useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import ConversationHeader from "@/components/messages/ConversationHeader";
import MessagesList from "@/components/messages/MessagesList";
import MessageInput from "@/components/messages/MessageInput";
import { useConversationMessages } from "@/hooks/useConversationMessages";

const Conversation = () => {
  const { id: adId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const otherId = searchParams.get('user');
  
  const { 
    messages, 
    isLoading, 
    adInfo, 
    otherUser, 
    sendMessage 
  } = useConversationMessages(adId, otherId);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <Card className="flex flex-col h-[calc(100vh-200px)]">
          <CardHeader className="border-b pb-3">
            <ConversationHeader 
              otherUser={otherUser} 
              adInfo={adInfo}
            />
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto py-4 px-2">
            <MessagesList 
              messages={messages}
              isLoading={isLoading}
            />
          </CardContent>
          
          <CardFooter className="border-t pt-3">
            <MessageInput 
              onSend={sendMessage}
              isLoading={isLoading}
            />
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Conversation;
