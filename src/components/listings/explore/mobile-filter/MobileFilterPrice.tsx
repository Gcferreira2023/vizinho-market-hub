
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

interface MobileFilterPriceProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  maxPrice?: number;
}

const MobileFilterPrice = ({
  priceRange,
  setPriceRange,
  maxPrice = 2000
}: MobileFilterPriceProps) => {
  // Check if price filter is active (not at default min/max values)
  const isPriceFilterActive = priceRange[0] > 0 || priceRange[1] < maxPrice;
  
  // Use useEffect to log when price range changes
  useEffect(() => {
    console.log(`MobileFilterPrice - priceRange: ${priceRange[0]}-${priceRange[1]}, maxPrice: ${maxPrice}`);
  }, [priceRange, maxPrice]);

  return (
    <div className="space-y-4">
      <Label className={isPriceFilterActive ? "text-primary font-medium" : ""}>
        Faixa de Preço
        {isPriceFilterActive && <span className="text-xs ml-1 text-primary">• Ativo</span>}
      </Label>
      <Slider
        defaultValue={[0, maxPrice / 2]}
        max={maxPrice}
        step={Math.max(10, Math.floor(maxPrice / 40))}
        value={priceRange}
        onValueChange={(value) => {
          setPriceRange(value as [number, number]);
          console.log(`Slider value changed to: ${value[0]}-${value[1]}`);
        }}
        className={isPriceFilterActive ? "text-primary" : ""}
      />
      <div className="flex justify-between">
        <span className={`text-sm ${isPriceFilterActive ? "text-primary font-medium" : ""}`}>
          R$ {priceRange[0]}
        </span>
        <span className={`text-sm ${isPriceFilterActive ? "text-primary font-medium" : ""}`}>
          R$ {priceRange[1]}
        </span>
      </div>
    </div>
  );
};

export default MobileFilterPrice;
