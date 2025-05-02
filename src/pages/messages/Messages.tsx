
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import ConversationList from "@/components/messages/ConversationList";
import EmptyMessages from "@/components/messages/EmptyMessages";
import { useConversations } from "@/hooks/useConversations";

const Messages = () => {
  const { conversations, isLoading } = useConversations();

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
          <ConversationList conversations={conversations} />
        ) : (
          <EmptyMessages />
        )}
      </div>
    </Layout>
  );
};

export default Messages;
