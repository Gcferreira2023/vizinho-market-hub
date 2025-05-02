
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSend: (message: string) => Promise<void>;
  isLoading: boolean;
}

const MessageInput = ({ onSend, isLoading }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isLoading) return;
    
    setIsSending(true);
    
    try {
      await onSend(newMessage.trim());
      setNewMessage("");
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full flex gap-2">
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
  );
};

export default MessageInput;
