
import ConversationItem from "./ConversationItem";

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

interface ConversationListProps {
  conversations: Conversation[];
}

const ConversationList = ({ conversations }: ConversationListProps) => {
  return (
    <div className="space-y-4">
      {conversations.map((conversation) => (
        <ConversationItem key={conversation.id} conversation={conversation} />
      ))}
    </div>
  );
};

export default ConversationList;
