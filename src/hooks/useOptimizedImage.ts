
import { useState, useEffect } from "react";
import { getOptimizedImageUrl, getResponsiveImageUrl } from "@/services/images/imageOptimizationService";

interface UseOptimizedImageProps {
  src: string;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  quality?: number;
}

export const useOptimizedImage = ({
  src,
  priority = false,
  sizes = "100vw",
  width,
  height,
  quality = 80
}: UseOptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [optimizedSrc, setOptimizedSrc] = useState("");
  
  useEffect(() => {
    if (!src) {
      setOptimizedSrc("/placeholder.svg");
      return;
    }
    
    // Resetar estados quando a URL da imagem muda
    setIsLoaded(false);
    setHasError(false);
    
    // Obter URL otimizada com base na largura do dispositivo
    if (width) {
      setOptimizedSrc(getOptimizedImageUrl(src, { width, quality }));
    } else {
      // Usar tamanhos responsivos se largura não for especificada
      setOptimizedSrc(getResponsiveImageUrl(src));
    }
  }, [src, width, quality]);
  
  const handleLoad = () => {
    setIsLoaded(true);
  };
  
  const handleError = () => {
    setHasError(true);
    setOptimizedSrc("/placeholder.svg");
    setIsLoaded(true);
  };
  
  return {
    optimizedSrc,
    isLoaded,
    hasError,
    handleLoad,
    handleError,
    blurProps: {
      loading: priority ? "eager" : "lazy",
      fetchPriority: priority ? "high" : "auto",
      sizes
    }
  };
};

export default useOptimizedImage;
