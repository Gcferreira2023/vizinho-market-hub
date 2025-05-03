
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageCircle, Star, User } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";
import { usePhoneMask } from "@/hooks/usePhoneMask";
import { Link } from "react-router-dom";

interface SellerInfoProps {
  seller: {
    id: string;
    name: string;
    apartment: string;
    block: string;
    rating: number;
    listings: number;
    phone?: string;
  };
}

const SellerInfo = ({ seller }: SellerInfoProps) => {
  const defaultPhone = "5511999999999"; // Telefone padrão caso o vendedor não tenha cadastrado
  const sellerPhone = seller.phone || defaultPhone;
  
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
          <WhatsAppButton 
            phone={sellerPhone}
            message={`Olá! Vi seu anúncio e gostaria de mais informações.`}
            className="w-full"
          />
          <Button variant="outline" className="w-full" asChild>
            <a href="mailto:suporte@seuapp.com">
              <MessageCircle size={18} className="mr-2" /> Contato por Email
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SellerInfo;
