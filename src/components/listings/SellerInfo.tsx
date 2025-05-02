
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageCircle, Phone, Star, User } from "lucide-react";

interface SellerInfoProps {
  seller: {
    id: string;
    name: string;
    apartment: string;
    block: string;
    rating: number;
    listings: number;
  };
  onContactWhatsApp: () => void;
}

const SellerInfo = ({ seller, onContactWhatsApp }: SellerInfoProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <h3 className="font-semibold text-lg">Informações do Vendedor</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <User size={24} className="text-primary" />
          </div>
          <div>
            <p className="font-medium">{seller.name}</p>
            <p className="text-sm text-gray-500">
              {seller.block} - {seller.apartment}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Star size={18} className="text-yellow-400 fill-yellow-400" />
          <span className="font-medium">{seller.rating}</span>
          <span className="text-sm text-gray-500">
            ({seller.listings} anúncios)
          </span>
        </div>

        <div className="pt-4 space-y-3">
          <Button className="w-full" onClick={onContactWhatsApp}>
            <Phone size={18} className="mr-2" /> Contato via WhatsApp
          </Button>
          <Button variant="outline" className="w-full">
            <MessageCircle size={18} className="mr-2" /> Enviar mensagem
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SellerInfo;
