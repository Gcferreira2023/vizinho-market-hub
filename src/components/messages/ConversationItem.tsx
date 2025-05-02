
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";

interface ConversationItemProps {
  conversation: {
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
  };
}

const ConversationItem = ({ conversation }: ConversationItemProps) => {
  return (
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
  );
};

export default ConversationItem;
