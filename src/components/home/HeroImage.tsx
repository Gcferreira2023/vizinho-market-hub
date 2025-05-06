
import { useState, useEffect } from "react";
import { Image as ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMobile } from "@/hooks/useMobile";
import { OptimizedImage } from "@/components/ui/optimized-image";

const HeroImage = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isMobile = useMobile();
  
  // Imagem otimizada com melhor qualidade, tamanho e versão responsiva
  const imageUrl = "https://images.unsplash.com/photo-1721322800607-8c38375eef04";
  
  // Use imagem de menor qualidade em dispositivos móveis
  const optimizedUrl = isMobile 
    ? `${imageUrl}?auto=format&q=70&w=640&fit=crop` 
    : `${imageUrl}?auto=format&q=80&w=1200&fit=crop`;
  
  useEffect(() => {
    // Pré-carregar a imagem em segundo plano usando o objeto HTMLImageElement
    const img = new window.Image();
    img.src = optimizedUrl;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => {
      setImageError(true);
      setImageLoaded(true);
    };
  }, [optimizedUrl]);
  
  return (
    <div className="md:w-1/2 flex justify-center px-4 md:px-0">
      <div className="w-full max-w-lg relative rounded-lg shadow-xl overflow-hidden">
        {!imageLoaded && (
          <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center">
            <Skeleton className="w-full h-full absolute" />
            <ImageIcon className="h-10 w-10 text-gray-400" />
          </div>
        )}
        <img
          src={imageError ? "/placeholder.svg" : optimizedUrl}
          alt="VizinhoMarket"
          className={`w-full object-cover transition-opacity duration-300 aspect-[4/3] ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageLoaded(true);
            setImageError(true);
          }}
          loading="eager" // Carrega com prioridade por ser above the fold
          fetchpriority="high"
          width={isMobile ? 640 : 1200}
          height={isMobile ? 480 : 900}
        />
      </div>
    </div>
  );
};

export default HeroImage;
