
import OptimizedImage from "@/components/ui/optimized-image";

const HeroImage = () => {
  // Use a reliable image source with timestamp to prevent caching issues
  const heroImageUrl = "/lovable-uploads/a761c01e-ede6-4e1b-b09e-cd61fdb6b0c6.png";
  
  return (
    <div className="md:w-1/2 flex justify-center px-4 md:px-0">
      <div className="w-full max-w-lg relative rounded-lg shadow-xl overflow-hidden bg-gray-100">
        <OptimizedImage
          src={heroImageUrl}
          alt="VizinhoMarket - Condomínio Residencial"
          className="w-full aspect-[4/3]"
          objectFit="cover"
          priority={true}
          aspectRatio="aspect-[4/3]"
        />
      </div>
    </div>
  );
};

export default HeroImage;
