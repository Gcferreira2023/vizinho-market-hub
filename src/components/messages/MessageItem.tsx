
import { useAuth } from "@/contexts/AuthContext";
import { Message } from "@/types/messages";

interface MessageItemProps {
  message: Message;
}

const MessageItem = ({ message }: MessageItemProps) => {
  const { user } = useAuth();
  const isOwn = message.sender_id === user?.id;
  
  return (
    <div 
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div 
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isOwn 
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        <p>{message.content}</p>
        <p 
          className={`text-xs ${
            isOwn 
              ? 'text-primary-foreground/70' 
              : 'text-gray-500'
          } mt-1`}
        >
          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default MessageItem;
