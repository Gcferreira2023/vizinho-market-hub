
import { useState } from "react";
import { Image } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const HeroImage = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Imagem otimizada com melhor qualidade e tamanho
  const imageUrl = "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&q=80&w=1200&fit=crop";
  
  return (
    <div className="md:w-1/2 flex justify-center">
      <div className="w-full max-w-lg relative rounded-lg shadow-xl overflow-hidden">
        {!imageLoaded && (
          <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center">
            <Skeleton className="w-full h-full absolute" />
            <Image className="h-10 w-10 text-gray-400" />
          </div>
        )}
        <img
          src={imageError ? "/placeholder.svg" : imageUrl}
          alt="VizinhoMarket"
          className={`w-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageLoaded(true);
            setImageError(true);
          }}
          loading="eager" // Carrega com prioridade por ser above the fold
          fetchPriority="high"
        />
      </div>
    </div>
  );
};

export default HeroImage;
