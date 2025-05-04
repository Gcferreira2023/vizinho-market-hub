
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageCircle, Star, User, Phone, Mail, MapPin } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";
import { useUserRatings } from "@/hooks/useUserRatings";
import RatingModal from "../ratings/RatingModal";
import UserRatingDisplay from "../ratings/UserRatingDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

interface SellerInfoProps {
  seller: {
    id: string;
    name: string;
    apartment?: string;
    block?: string;
    rating?: number;
    listings?: number;
    phone?: string;
    condominium?: {
      name: string;
      id: string;
    };
  };
  adId?: string;
  isOwner?: boolean;
  viewCount?: number;
}

const SellerInfo = ({ seller, adId, isOwner = false, viewCount = 0 }: SellerInfoProps) => {
  const { user } = useAuth();
  const defaultPhone = "5511999999999"; // Telefone padrão caso o vendedor não tenha cadastrado
  const sellerPhone = seller?.phone || defaultPhone;
  const { ratings, summary, isLoading } = useUserRatings(seller.id);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  
  const isLoaded = seller.id !== "";
  const isLoggedIn = !!user;
  
  return (
    <Card className="mb-6 sticky top-6">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">Informações do Vendedor</h3>
          {viewCount > 0 && (
            <Badge variant="outline" className="text-xs">
              {viewCount} {viewCount === 1 ? 'visualização' : 'visualizações'}
            </Badge>
          )}
        </div>
        
        {!isLoggedIn && (
          <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded-md">
            Não é necessário cadastro para contatar vendedores
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {!isLoaded ? (
          <>
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User size={24} className="text-primary" />
              </div>
              <div>
                <p className="font-medium">{seller.name}</p>
                {seller.block && seller.apartment && (
                  <p className="text-sm text-gray-500">
                    {seller.block} - {seller.apartment}
                  </p>
                )}
                {isOwner && (
                  <p className="text-xs text-primary font-medium mt-1">
                    Este anúncio é seu
                  </p>
                )}
              </div>
            </div>
            
            {seller.condominium && (
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
                <MapPin size={16} className="text-primary" />
                <span className="text-sm">{seller.condominium.name}</span>
              </div>
            )}
            
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

            {!isOwner && (
              <div className="pt-2 space-y-3 sticky bottom-0 bg-white">
                <div className="font-semibold text-sm mb-2">Contatar vendedor:</div>
                <WhatsAppButton 
                  phone={sellerPhone}
                  message={`Olá! Vi seu anúncio e gostaria de mais informações.`}
                  className="w-full"
                />
                
                <div className="flex gap-2 w-full">
                  <Button variant="outline" className="flex-1" asChild>
                    <a href={`tel:${sellerPhone}`}>
                      <Phone size={18} className="mr-2" /> Ligar
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="flex-1" asChild>
                    <a href="mailto:suporte@seuapp.com">
                      <Mail size={18} className="mr-2" /> Email
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
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
