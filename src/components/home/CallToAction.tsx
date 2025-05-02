
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center mb-6">
          <ShoppingCart size={48} />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Tem algo para vender ou oferecer?
        </h2>
        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
          Cadastre-se agora e comece a anunciar seus produtos e serviços para os moradores do seu condomínio.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" variant="secondary" className="text-lg py-6" asChild>
            <Link to="/anunciar">Anunciar Agora</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
            <Link to="/como-funciona">Como funciona</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
