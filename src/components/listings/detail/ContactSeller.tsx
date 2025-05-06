
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, User } from "lucide-react";

type ContactSellerProps = {
  listing: {
    user_name?: string;
    seller_name?: string;
    location?: string;
    phone?: string;
  };
};

const ContactSeller = ({ listing }: ContactSellerProps) => {
  const sellerName = listing?.user_name || listing?.seller_name || "Anunciante";
  
  const handleWhatsAppClick = () => {
    if (listing?.phone) {
      // Formatar número de telefone para WhatsApp
      const phoneNumber = listing.phone.replace(/\D/g, "");
      const whatsappUrl = `https://wa.me/55${phoneNumber}?text=Olá! Vi seu anúncio e gostaria de mais informações.`;
      window.open(whatsappUrl, "_blank");
    }
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
        
        {listing?.phone && (
          <div className="mt-6">
            <Button 
              onClick={handleWhatsAppClick}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              <Phone className="mr-2 h-4 w-4" />
              Contatar por WhatsApp
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ContactSeller;
