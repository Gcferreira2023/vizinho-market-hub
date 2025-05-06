
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface MobileFilterPriceProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

const MobileFilterPrice = ({
  priceRange,
  setPriceRange
}: MobileFilterPriceProps) => {
  return (
    <div className="space-y-4">
      <Label>Faixa de Preço</Label>
      <Slider
        defaultValue={[0, 500]}
        max={500}
        step={10}
        value={priceRange}
        onValueChange={setPriceRange}
      />
      <div className="flex justify-between">
        <span className="text-sm">R$ {priceRange[0]}</span>
        <span className="text-sm">R$ {priceRange[1]}</span>
      </div>
    </div>
  );
};

export default MobileFilterPrice;
