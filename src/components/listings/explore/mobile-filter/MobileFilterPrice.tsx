
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

interface MobileFilterPriceProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

const MobileFilterPrice = ({
  priceRange,
  setPriceRange
}: MobileFilterPriceProps) => {
  // Determinar o valor máximo para o slider com base no range de preços
  const MAX_PRICE = 2000; // Aumentamos para 2000 para cobrir produtos mais caros
  
  // Use useEffect to log when price range changes
  useEffect(() => {
    console.log(`MobileFilterPrice - priceRange: ${priceRange[0]}-${priceRange[1]}`);
  }, [priceRange]);

  return (
    <div className="space-y-4">
      <Label>Faixa de Preço</Label>
      <Slider
        defaultValue={[0, MAX_PRICE / 2]}
        max={MAX_PRICE}
        step={50}
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
