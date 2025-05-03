
import { ImageIcon } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="flex items-center justify-center py-4 text-gray-500">
      <ImageIcon className="mr-2 h-5 w-5" />
      <span className="text-sm">Adicione pelo menos uma imagem</span>
    </div>
  );
};

export default EmptyState;
