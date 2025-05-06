
import { useState, useEffect } from "react";
import { Image as ImageIcon, ImageOff, AlertTriangle } from "lucide-react";

interface UseImageLoaderProps {
  imageUrl: string;
  isMockListing: boolean;
  lazyLoad: boolean;
  id: string;
  onImageLoad?: () => void;
}

export const useImageLoader = ({
  imageUrl,
  isMockListing,
  lazyLoad,
  id,
  onImageLoad
}: UseImageLoaderProps) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazyLoad);

  // Para anúncios mockados, sempre usamos um placeholder
  const actualImageUrl = isMockListing || !imageUrl 
    ? "/placeholder.svg" 
    : imageUrl;
  
  // Carregar imagem antecipadamente para verificar erros
  useEffect(() => {
    if (actualImageUrl && actualImageUrl !== "/placeholder.svg") {
      const img = new Image();
      img.src = actualImageUrl;
      img.onload = () => {
        setImgError(false);
      };
      img.onerror = () => {
        console.error(`Erro ao pré-carregar imagem: ${actualImageUrl}`);
        setImgError(true);
      };
    }
  }, [actualImageUrl]);

  // Lazy loading observer
  useEffect(() => {
    if (!lazyLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const currentCard = document.getElementById(`listing-card-${id}`);
    if (currentCard) {
      observer.observe(currentCard);
    }

    return () => {
      observer.disconnect();
    };
  }, [id, lazyLoad]);
  
  // Debug para carregamento de imagem
  useEffect(() => {
    if (isVisible) {
      console.log(`Card ${id} carregando imagem:`, actualImageUrl);
    }
  }, [isVisible, actualImageUrl, id]);
  
  const handleImageLoad = () => {
    console.log(`Imagem carregada com sucesso: ${actualImageUrl}`);
    setImgLoaded(true);
    if (onImageLoad) onImageLoad();
  };
  
  const handleImageError = () => {
    console.error(`Erro ao carregar imagem ${actualImageUrl}, usando placeholder`);
    setImgError(true);
    setImgLoaded(true);
    if (onImageLoad) onImageLoad();
  };

  return {
    imgError,
    imgLoaded,
    isVisible,
    actualImageUrl,
    handleImageLoad,
    handleImageError
  };
};
