
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

interface MobileFilterPriceProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  maxPrice?: number; // Adicionando o prop para o preço máximo dinâmico
}

const MobileFilterPrice = ({
  priceRange,
  setPriceRange,
  maxPrice = 2000 // Valor padrão caso não seja fornecido
}: MobileFilterPriceProps) => {
  
  // Use useEffect to log when price range changes
  useEffect(() => {
    console.log(`MobileFilterPrice - priceRange: ${priceRange[0]}-${priceRange[1]}, maxPrice: ${maxPrice}`);
  }, [priceRange, maxPrice]);

  return (
    <div className="space-y-4">
      <Label>Faixa de Preço</Label>
      <Slider
        defaultValue={[0, maxPrice / 2]}
        max={maxPrice}
        step={Math.max(10, Math.floor(maxPrice / 40))} // Ajuste o step com base no maxPrice
        value={priceRange}
        onValueChange={(value) => {
          setPriceRange(value as [number, number]);
          console.log(`Slider value changed to: ${value[0]}-${value[1]}`);
        }}
      />
      <div className="flex justify-between">
        <span className="text-sm">R$ {priceRange[0]}</span>
        <span className="text-sm">R$ {priceRange[1]}</span>
      </div>
    </div>
  );
};

export default MobileFilterPrice;
