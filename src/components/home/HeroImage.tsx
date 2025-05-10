
import React from "react";

const HeroImage = () => {
  // Imagem que remete ao comércio entre vizinhos (compartilhar, vender, trocar)
  const heroImageUrl = "/lovable-uploads/e2f53080-25f1-41fe-9777-edff03f14f94.png";
  
  return (
    <div className="md:w-1/2 flex justify-center px-4 md:px-0">
      <div className="w-full max-w-lg relative rounded-lg shadow-xl overflow-hidden bg-gray-100">
        <img 
          src={heroImageUrl}
          alt="VizinhoMarket - Comércio entre vizinhos no condomínio"
          className="w-full aspect-[4/3] object-cover"
          loading="eager"
          fetchPriority="high"
        />
      </div>
    </div>
  );
};

export default HeroImage;
