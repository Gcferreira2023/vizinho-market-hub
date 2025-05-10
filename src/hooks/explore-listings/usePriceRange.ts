
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
      setPriceRange(prev => [prev[0], dynamicMaxPrice]);
      console.log(`Atualizando range de preço com máximo dinâmico: R$${dynamicMaxPrice}`);
    }
  }, [dynamicMaxPrice, maxPriceLoading, setPriceRange]);

  return {
    maxPrice: dynamicMaxPrice,
    isMaxPriceLoading: maxPriceLoading
  };
}
