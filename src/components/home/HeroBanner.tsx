
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Dados de exemplo para o banner
const bannerItems = [
  {
    id: "banner1",
    title: "Ofertas Especiais",
    description: "Confira os melhores produtos e serviços do seu condomínio com descontos exclusivos",
    image: "https://images.unsplash.com/photo-1556745753-b2904692b3cd",
    link: "/explorar",
    type: "destaque"
  },
  {
    id: "banner2",
    title: "Conheça Nossos Serviços",
    description: "Profissionais qualificados disponíveis para atender suas necessidades",
    image: "https://images.unsplash.com/photo-1521791055366-0d553872125f",
    link: "/explorar?tipo=servico",
    type: "serviços"
  },
  {
    id: "banner3",
    title: "Produtos Artesanais",
    description: "Itens exclusivos feitos por moradores do seu condomínio",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f",
    link: "/explorar?categoria=produtos-gerais",
    type: "produtos"
  }
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <Carousel 
          className="w-full"
          onSelect={(index) => setCurrentSlide(index)}
        >
          <CarouselContent>
            {bannerItems.map((item, index) => (
              <CarouselItem key={item.id}>
                <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden rounded-xl">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 md:p-8">
                    <Badge className="mb-2 self-start">{item.type}</Badge>
                    <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">{item.title}</h2>
                    <p className="text-white/90 mb-4 max-w-xl">{item.description}</p>
                    <Button asChild className="self-start">
                      <Link to={item.link}>Ver Agora</Link>
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-4 gap-2">
            {bannerItems.map((_, index) => (
              <button
                key={`dot-${index}`}
                className={`h-2.5 w-2.5 rounded-full ${
                  currentSlide === index ? "bg-primary" : "bg-gray-300"
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
          <CarouselPrevious className="hidden md:flex left-2" />
          <CarouselNext className="hidden md:flex right-2" />
        </Carousel>
      </div>
    </section>
  );
};

export default HeroBanner;
