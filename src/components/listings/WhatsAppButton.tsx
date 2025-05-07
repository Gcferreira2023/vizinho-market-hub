
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useMobile } from "@/hooks/useMobile";

interface WhatsAppButtonProps {
  phone: string;
  message?: string;
  className?: string;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  showIcon?: boolean;
  onButtonClick?: () => void;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  phone, 
  message = "Olá! Vi seu anúncio e gostaria de mais informações.", 
  className = "",
  variant = "default",
  size = "default",
  showIcon = true,
  onButtonClick
}) => {
  const isMobile = useMobile();
  
  // Clean up non-numeric characters from phone
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Ensure the phone number starts with country code (Brazil = 55)
  const formattedPhone = cleanPhone.startsWith('55') 
    ? cleanPhone 
    : `55${cleanPhone}`;
  
  // URL encode the message
  const encodedMessage = encodeURIComponent(message);
  
  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;

  const handleClick = () => {
    // Track click if callback is provided
    if (onButtonClick) {
      onButtonClick();
    }
    
    // Log interaction for analytics purposes
    console.log("WhatsApp button clicked for phone:", formattedPhone);
    
    // Open WhatsApp link
    window.open(whatsappUrl, '_blank');
  };
  
  return (
    <Button 
      onClick={handleClick}
      variant={variant}
      size={size}
      className={`bg-green-500 hover:bg-green-600 ${isMobile ? 'py-3 text-base' : ''} ${className}`}
    >
      {showIcon && (
        <MessageSquare className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'} mr-2`} />
      )}
      WhatsApp
    </Button>
  );
};

export default WhatsAppButton;
