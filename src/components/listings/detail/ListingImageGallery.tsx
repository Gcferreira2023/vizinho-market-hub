
import React, { useState } from "react";

export const ListingImageGallery = ({ 
  images = [] 
}: { 
  images: string[] 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Se não houver imagens, mostra um placeholder
  if (images.length === 0) {
    return (
      <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
        <p className="text-gray-500">Sem imagens disponíveis</p>
      </div>
    );
  }
  
  return (
    <div className="mb-6">
      {/* Imagem principal */}
      <div className="w-full h-80 overflow-hidden rounded-lg mb-2">
        <img 
          src={images[activeIndex]} 
          alt={`Imagem principal ${activeIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="flex overflow-x-auto space-x-2 py-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-20 h-20 rounded overflow-hidden flex-shrink-0 border-2 ${
                index === activeIndex ? 'border-primary' : 'border-transparent'
              }`}
            >
              <img 
                src={image} 
                alt={`Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
