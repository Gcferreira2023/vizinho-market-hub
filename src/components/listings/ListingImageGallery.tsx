
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ListingImageGalleryProps {
  images: string[];
  title: string;
}

const ListingImageGallery = ({ images, title }: ListingImageGalleryProps) => {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="mb-6">
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="aspect-[4/3] w-full overflow-hidden rounded-lg">
                <img
                  src={image}
                  alt={`${title} - Imagem ${index + 1}`}
                  className="w-full h-full object-cover cursor-zoom-in transition-all hover:scale-105"
                  onClick={() => {
                    // Em uma versão real, abriria um modal para zoom
                    console.log("Zoom da imagem", index);
                  }}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>

      {/* Miniaturas das imagens */}
      <div className="flex mt-4 gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={`w-20 h-20 overflow-hidden rounded-md transition-all ${
              activeImage === index
                ? "border-2 border-primary ring-2 ring-primary/30"
                : "border border-gray-200 opacity-70 hover:opacity-100"
            }`}
            onClick={() => setActiveImage(index)}
          >
            <img
              src={image}
              alt={`Miniatura ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ListingImageGallery;
