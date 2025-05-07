
import OptimizedImage from "@/components/ui/optimized-image";

const HeroImage = () => {
  // Single, reliable high-quality image from Unsplash (with proper licensing)
  const heroImageUrl = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop";
  
  return (
    <div className="md:w-1/2 flex justify-center px-4 md:px-0">
      <div className="w-full max-w-lg relative rounded-lg shadow-xl overflow-hidden bg-gray-100">
        <OptimizedImage
          src={heroImageUrl}
          alt="VizinhoMarket - Condomínio Residencial"
          className="w-full aspect-[4/3]"
          objectFit="cover"
          priority={true}
          fallbackSrc="/lovable-uploads/a761c01e-ede6-4e1b-b09e-cd61fdb6b0c6.png"
          aspectRatio="aspect-[4/3]"
        />
      </div>
    </div>
  );
};

export default HeroImage;
