
import React from 'react';
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
  phone: string;
  message?: string;
  className?: string;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  phone, 
  message = "Olá! Vi seu anúncio e gostaria de mais informações.", 
  className = "",
  variant = "default",
  size = "default"
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
      <svg 
        className="w-5 h-5 mr-2" 
        fill="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12 6.628 0 12-5.373 12-12 0-6.627-5.372-12-12-12zm.029 18.88a7.947 7.947 0 0 1-3.77-.954l-4.174 1.094 1.116-4.075a7.937 7.937 0 0 1-1.039-3.945c0-4.374 3.556-7.93 7.93-7.93 4.374 0 7.93 3.556 7.93 7.93.001 4.374-3.554 7.93-7.928 7.93z" fillRule="nonzero"/>
      </svg>
      WhatsApp
    </Button>
  );
};

export default WhatsAppButton;
