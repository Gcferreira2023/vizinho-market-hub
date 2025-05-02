
import { useState } from "react";

export function usePhoneMask() {
  const [masked, setMasked] = useState("");

  const applyMask = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numericValue = value.replace(/\D/g, "");
    
    // Limita o tamanho para 11 dígitos (formato brasileiro)
    const limitedValue = numericValue.slice(0, 11);
    
    // Aplica a máscara
    let maskedValue = limitedValue;
    if (limitedValue.length > 0) {
      maskedValue = `(${limitedValue.slice(0, 2)}`;
      
      if (limitedValue.length > 2) {
        maskedValue += `) ${limitedValue.slice(2, 7)}`;
        
        if (limitedValue.length > 7) {
          maskedValue += `-${limitedValue.slice(7)}`;
        }
      }
    }
    
    setMasked(maskedValue);
    return maskedValue;
  };

  return {
    maskedValue: masked,
    applyMask,
    getRawValue: () => masked.replace(/\D/g, "")
  };
}
