
import { useState, useEffect } from "react";
import { ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const HeroImage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState("");

  // Array de imagens de condomínios/casas de alta qualidade de diferentes fontes
  const heroImages = [
    // Imagens hospedadas no bucket (já existentes no projeto)
    "/lovable-uploads/1eb7a9ee-15c6-4be9-bc68-ecfc1c5640be.png", // Imagem principal
    "/lovable-uploads/a761c01e-ede6-4e1b-b09e-cd61fdb6b0c6.png", // Imagem fallback
    
    // Lista de URLs de imagens gratuitas (Unsplash)
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1170&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1170&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1174&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1170&auto=format&fit=crop",
  ];
  
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    
    // Primeiro tentamos a imagem principal do bucket
    let selectedImage = heroImages[0];
    console.log("Tentando carregar imagem principal:", selectedImage);
    setImgSrc(selectedImage);
    
    // Preload da imagem para verificar se ela carrega corretamente
    const preloadImage = new Image();
    preloadImage.src = selectedImage;
    
    preloadImage.onload = () => {
      setIsLoaded(true);
      console.log("Hero image preloaded successfully:", selectedImage);
    };
    
    preloadImage.onerror = () => {
      console.error("Failed to preload main hero image, trying alternatives");
      // Se falhar, tentaremos o próximo da lista
      tryNextImage(1);
    };
    
    return () => {
      preloadImage.onload = null;
      preloadImage.onerror = null;
    };
  }, []);
  
  // Função para tentar carregar a próxima imagem da lista
  const tryNextImage = (index) => {
    if (index >= heroImages.length) {
      console.error("All hero images failed to load");
      setHasError(true);
      return;
    }
    
    const nextImage = heroImages[index];
    console.log(`Trying next hero image (${index + 1}/${heroImages.length}):`, nextImage);
    setImgSrc(nextImage);
    
    const img = new Image();
    img.src = nextImage;
    
    img.onload = () => {
      setIsLoaded(true);
      console.log("Alternative hero image loaded successfully:", nextImage);
    };
    
    img.onerror = () => {
      console.error(`Failed to load hero image ${index + 1}, trying next one`);
      tryNextImage(index + 1);
    };
  };
  
  const handleLoad = () => {
    setIsLoaded(true);
    console.log("Hero image loaded successfully:", imgSrc);
  };
  
  const handleError = () => {
    console.error("Failed to load hero image in component:", imgSrc);
    
    // Se a imagem atual falhar, tente a próxima
    const currentIndex = heroImages.indexOf(imgSrc);
    if (currentIndex !== -1 && currentIndex + 1 < heroImages.length) {
      tryNextImage(currentIndex + 1);
    } else {
      setHasError(true);
    }
  };
  
  return (
    <div className="md:w-1/2 flex justify-center px-4 md:px-0">
      <div className="w-full max-w-lg relative rounded-lg shadow-xl overflow-hidden bg-gray-100">
        {/* Estado de carregamento */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
            <Skeleton className="w-full h-full absolute" />
            <ImageIcon className="h-10 w-10 text-gray-400" />
          </div>
        )}
        
        <img
          src={imgSrc}
          alt="VizinhoMarket - Condomínio"
          className={`w-full aspect-[4/3] object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
        />

        {/* Estado de erro */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-20">
            <div className="bg-background/80 p-3 rounded-full">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroImage;
