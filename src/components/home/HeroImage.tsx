
import { useState, useEffect } from "react";
import OptimizedImage from "@/components/ui/optimized-image";

const HeroImage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Array of high-quality condominium/residential images from various sources
  const heroImages = [
    // Images hosted in the bucket (already in project)
    "/lovable-uploads/1eb7a9ee-15c6-4be9-bc68-ecfc1c5640be.png", // Main image
    "/lovable-uploads/a761c01e-ede6-4e1b-b09e-cd61fdb6b0c6.png", // Fallback image
    
    // Free image URLs from Unsplash (with proper licensing)
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1170&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1170&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1174&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1170&auto=format&fit=crop",
  ];

  // Handle error by trying the next image
  const handleImageError = () => {
    if (currentImageIndex < heroImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  return (
    <div className="md:w-1/2 flex justify-center px-4 md:px-0">
      <div className="w-full max-w-lg relative rounded-lg shadow-xl overflow-hidden bg-gray-100">
        <OptimizedImage
          src={heroImages[currentImageIndex]}
          alt="VizinhoMarket - Condomínio"
          className="w-full aspect-[4/3]"
          objectFit="cover"
          priority={true}
          fallbackSrc="/lovable-uploads/a761c01e-ede6-4e1b-b09e-cd61fdb6b0c6.png"
          onLoad={() => console.log("Hero image loaded successfully:", heroImages[currentImageIndex])}
          aspectRatio="aspect-[4/3]"
        />
      </div>
    </div>
  );
};

export default HeroImage;
