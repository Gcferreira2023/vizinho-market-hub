
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";

interface AdInfo {
  id: string;
  title: string;
}

interface UserInfo {
  id: string;
  name: string;
}

interface ConversationHeaderProps {
  otherUser: UserInfo | null;
  adInfo: AdInfo | null;
}

const ConversationHeader = ({ otherUser, adInfo }: ConversationHeaderProps) => {
  return (
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
  );
};

export default ConversationHeader;
