
import { useRef, useEffect } from "react";
import MessageItem from "./MessageItem";

interface Message {
  id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  sender_id: string;
  receiver_id: string;
}

interface MessagesListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessagesList = ({ messages, isLoading }: MessagesListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Rolar para o final da conversa quando houver novas mensagens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Carregando mensagens...</p>
      </div>
    );
  }
  
  if (messages.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-center">
        <p className="text-gray-500">Nenhuma mensagem ainda.</p>
        <p className="text-gray-500">Envie uma mensagem para iniciar a conversa.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;
