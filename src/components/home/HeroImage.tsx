
import { ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMobile } from "@/hooks/useMobile";
import { OptimizedImage } from "@/components/ui/optimized-image";

const HeroImage = () => {
  const isMobile = useMobile();
  
  // Use the furniture placeholder as the main image since hero-image.jpg is not loading
  const imageUrl = "/placeholder-furniture.jpg";
  
  return (
    <div className="md:w-1/2 flex justify-center px-4 md:px-0">
      <div className="w-full max-w-lg relative rounded-lg shadow-xl overflow-hidden">
        <OptimizedImage
          src={imageUrl}
          alt="VizinhoMarket"
          className="w-full"
          aspectRatio="aspect-[4/3]"
          objectFit="cover"
          priority={true}
          width={isMobile ? 640 : 1200}
          height={isMobile ? 480 : 900}
        />
      </div>
    </div>
  );
};

export default HeroImage;
