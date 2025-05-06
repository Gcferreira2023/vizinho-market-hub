
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Shield } from "lucide-react";

interface ContactSellerProps {
  listing: any;
}

const ContactSeller = ({ listing }: ContactSellerProps) => {
  // Format phone number if available
  const formatPhone = (phone: string | null | undefined) => {
    if (!phone) return "Não informado";
    
    // Basic Brazilian phone formatting (XX) XXXXX-XXXX
    return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  };
  
  // Seller name or default value
  const sellerName = listing?.user_name || "Vendedor";
  
  // Seller location info
  const getLocationInfo = () => {
    const block = listing?.user_block || "-";
    const apt = listing?.user_apartment || "-";
    
    return `Bloco ${block}, Apt ${apt}`;
  };
  
  const handleWhatsAppClick = () => {
    if (!listing?.user_phone) return;
    
    // Format phone number for WhatsApp
    let phone = listing.user_phone.replace(/\D/g, "");
    if (phone.length === 11 && !phone.startsWith("55")) {
      phone = `55${phone}`;
    }
    
    // Create WhatsApp message with listing info
    const message = encodeURIComponent(
      `Olá! Vi seu anúncio "${listing.title}" no Vizinho Market e gostaria de mais informações.`
    );
    
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Contato</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Seller info */}
          <div>
            <p className="font-medium text-lg">{sellerName}</p>
            
            {listing?.user_block && (
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <MapPin size={14} />
                <span>{getLocationInfo()}</span>
              </div>
            )}
          </div>
          
          {/* Contact buttons */}
          <div className="pt-2">
            <Button 
              className="w-full mb-2" 
              onClick={handleWhatsAppClick}
              disabled={!listing?.user_phone}
            >
              <Phone className="mr-2 h-4 w-4" />
              Contatar via WhatsApp
            </Button>
            
            <div className="text-xs text-gray-500 mt-2 flex items-start gap-1">
              <Shield className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <p>Você entrará em contato diretamente com o vendedor.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactSeller;
