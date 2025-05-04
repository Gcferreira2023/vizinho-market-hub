
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface WhatsAppButtonProps {
  phone: string;
  message?: string;
  className?: string;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  showIcon?: boolean;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  phone, 
  message = "Olá! Vi seu anúncio e gostaria de mais informações.", 
  className = "",
  variant = "default",
  size = "default",
  showIcon = true
}) => {
  // Remover caracteres não numéricos do telefone
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Garantir que o telefone comece com o código do país (Brasil = 55)
  const formattedPhone = cleanPhone.startsWith('55') 
    ? cleanPhone 
    : `55${cleanPhone}`;
  
  // Codificar a mensagem para URL
  const encodedMessage = encodeURIComponent(message);
  
  // Criar o link do WhatsApp
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;

  const handleClick = () => {
    window.open(whatsappUrl, '_blank');
  };
  
  return (
    <Button 
      onClick={handleClick}
      variant={variant}
      size={size}
      className={`bg-green-500 hover:bg-green-600 ${className}`}
    >
      {showIcon && (
        <MessageSquare className="w-5 h-5 mr-2" />
      )}
      WhatsApp
    </Button>
  );
};

export default WhatsAppButton;
