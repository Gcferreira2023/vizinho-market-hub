
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-primary/10 to-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Compre e venda no seu condomínio
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              O VizinhoMarket conecta moradores do seu condomínio para comprar e vender produtos e serviços de forma prática e segura.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" asChild>
                <Link to="/cadastro">Cadastre-se</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/explorar">Explorar anúncios</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1721322800607-8c38375eef04"
              alt="VizinhoMarket"
              className="w-full max-w-lg rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
