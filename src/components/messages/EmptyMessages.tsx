
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const EmptyMessages = () => {
  return (
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
  );
};

export default EmptyMessages;
