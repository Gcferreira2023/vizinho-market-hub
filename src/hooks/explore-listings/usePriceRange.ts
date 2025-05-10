
import { useEffect } from "react";
import { useMaxPrice } from "../useMaxPrice";

/**
 * Hook for handling dynamic price range functionality
 */
export function usePriceRange(
  priceRange: [number, number],
  setPriceRange: (range: [number, number]) => void,
  defaultMaxPrice: number = 2000
) {
  // Fetch max price from database
  const { maxPrice: dynamicMaxPrice, loading: maxPriceLoading } = useMaxPrice(defaultMaxPrice);

  // Update price range when dynamic max price loads
  useEffect(() => {
    if (!maxPriceLoading && dynamicMaxPrice) {
      // Create a new array for the updated price range
      const newPriceRange: [number, number] = [priceRange[0], dynamicMaxPrice];
      setPriceRange(newPriceRange);
      console.log(`Atualizando range de preço com máximo dinâmico: R$${dynamicMaxPrice}`);
    }
  }, [dynamicMaxPrice, maxPriceLoading, setPriceRange, priceRange]);

  return {
    maxPrice: dynamicMaxPrice,
    isMaxPriceLoading: maxPriceLoading
  };
}
