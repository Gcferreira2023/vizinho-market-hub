
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageCircle, Star, User } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";
import { usePhoneMask } from "@/hooks/usePhoneMask";
import { Link } from "react-router-dom";
import UserRatingDisplay from "../ratings/UserRatingDisplay";
import { useUserRatings } from "@/hooks/useUserRatings";
import RatingModal from "../ratings/RatingModal";

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
  adId?: string;
}

const SellerInfo = ({ seller, adId }: SellerInfoProps) => {
  const defaultPhone = "5511999999999"; // Telefone padrão caso o vendedor não tenha cadastrado
  const sellerPhone = seller.phone || defaultPhone;
  const { ratings, summary, isLoading } = useUserRatings(seller.id);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  
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
          {isLoading ? (
            <div className="flex items-center gap-1">
              <Star size={18} className="text-gray-300" />
              <span className="text-sm text-gray-500">Carregando...</span>
            </div>
          ) : (
            <UserRatingDisplay 
              summary={summary}
              size="md"
              showCount={true}
              className="cursor-pointer hover:opacity-80"
              onClick={() => setRatingModalOpen(true)}
            />
          )}
        </div>

        <Button 
          variant="ghost" 
          className="text-sm p-0 h-auto hover:bg-transparent hover:underline text-primary"
          onClick={() => setRatingModalOpen(true)}
        >
          Ver avaliações e avaliar este vendedor
        </Button>

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
      
      <RatingModal 
        open={ratingModalOpen}
        onOpenChange={setRatingModalOpen}
        userId={seller.id}
        userName={seller.name}
        adId={adId}
      />
    </Card>
  );
};

export default SellerInfo;
