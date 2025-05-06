
import HeroHeading from "./HeroHeading";
import HeroButtons from "./HeroButtons";
import HeroImage from "./HeroImage";
import LocationFilters from "./LocationFilters";

const HeroSection = () => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-primary/10 to-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <HeroHeading />
            <HeroButtons />
          </div>
          <HeroImage />
        </div>
        
        {/* Filtros de localização abaixo dos botões */}
        <div className="mt-8">
          <LocationFilters />
        </div>
        
        {/* Botão de busca com melhor visual */}
        <div className="mt-6 flex justify-center">
          <a 
            href="/explorar" 
            className="px-8 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors w-full md:w-auto md:min-w-[200px] text-center"
          >
            Buscar anúncios
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
