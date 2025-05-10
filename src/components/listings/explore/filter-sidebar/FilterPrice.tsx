
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useEffect } from "react";

interface FilterPriceProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  maxPrice?: number;
}

const FilterPrice = ({
  priceRange,
  setPriceRange,
  maxPrice = 2000
}: FilterPriceProps) => {
  
  // Log when price range changes for debugging
  useEffect(() => {
    console.log(`FilterPrice - priceRange: ${priceRange[0]}-${priceRange[1]}, maxPrice: ${maxPrice}`);
  }, [priceRange, maxPrice]);
  
  return (
    <div className="space-y-4">
      <Label>Faixa de Preço</Label>
      <Slider
        defaultValue={[0, maxPrice / 2]}
        max={maxPrice}
        step={Math.max(10, Math.floor(maxPrice / 40))} // Adjust step based on maxPrice
        value={priceRange}
        onValueChange={(value) => {
          setPriceRange(value as [number, number]);
          console.log(`Sidebar slider changed to: ${value[0]}-${value[1]}`);
        }}
      />
      <div className="flex justify-between">
        <span className="text-sm">R$ {priceRange[0]}</span>
        <span className="text-sm">R$ {priceRange[1]}</span>
      </div>
    </div>
  );
};

export default FilterPrice;
