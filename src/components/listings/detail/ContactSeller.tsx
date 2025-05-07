
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, User } from "lucide-react";
import { useMobile } from "@/hooks/useMobile";
import WhatsAppButton from "@/components/listings/WhatsAppButton";
import UserLocationInfo from "@/components/user/UserLocationInfo";

type ContactSellerProps = {
  listing: {
    user_name?: string;
    seller_name?: string;
    location?: string;
    phone?: string;
    apartment?: string;
    block?: string;
    condominium_name?: string;
    condominium_id?: string;
  };
};

const ContactSeller = ({ listing }: ContactSellerProps) => {
  const sellerName = listing?.user_name || listing?.seller_name || "Anunciante";
  const isMobile = useMobile();
  const [clickCount, setClickCount] = useState(0);
  
  // Usar o número de telefone do vendedor ou o padrão somente se necessário
  const phoneNumber = listing?.phone || "5511999999999";
  
  const handlePhoneClick = () => {
    window.location.href = `tel:+55${phoneNumber.replace(/\D/g, "")}`;
    setClickCount(prev => prev + 1);
  };
  
  const handleWhatsAppClick = () => {
    setClickCount(prev => prev + 1);
    // Esta função será encaminhada para o WhatsAppButton
    console.log("WhatsApp button clicked, total clicks:", clickCount + 1);
  };
  
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Informações do Anunciante</h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Vendedor</p>
            <p className="font-medium">{sellerName}</p>
          </div>
        </div>
        
        {listing?.location && (
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Localização</p>
              <p className="font-medium">{listing.location}</p>
            </div>
          </div>
        )}
        
        {/* Mostrar informações do condomínio se disponível */}
        {listing?.condominium_id && (
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Condomínio</p>
              <p className="font-medium">
                {listing.condominium_name || "Condomínio do Vendedor"}
              </p>
              {listing.block && listing.apartment && (
                <p className="text-xs text-gray-500">
                  Bloco {listing.block}, Apt {listing.apartment}
                </p>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-3 text-sm text-green-600 bg-green-50 p-2 rounded-md">
          Não é necessário cadastro para contatar vendedores
        </div>
        
        <div className="mt-6 space-y-3 sticky bottom-0 bg-white">
          <WhatsAppButton 
            phone={phoneNumber}
            className={`w-full ${isMobile ? 'py-3' : ''}`}
            message="Olá! Vi seu anúncio e gostaria de mais informações."
            onButtonClick={handleWhatsAppClick}
          />
          
          <Button 
            onClick={handlePhoneClick}
            variant="outline"
            className={`w-full ${isMobile ? 'py-3' : ''}`}
          >
            <Phone className="mr-2 h-4 w-4" />
            Ligar para o Vendedor
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ContactSeller;
