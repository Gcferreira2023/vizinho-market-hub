
import { useAuth } from "@/contexts/AuthContext";
import { User, ArrowRight, CheckCircle2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroHeading = () => {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
    <>
      <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
        Compre e venda no seu condomínio
      </h1>
      <p className="text-lg text-gray-600 mb-4">
        O VizinhoMarket conecta moradores do seu condomínio para comprar e vender produtos e serviços de forma prática e segura.
      </p>
      
      {!isLoggedIn && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-sm mb-6 animate-fade-in">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold mb-1">Navegue à vontade! Não é necessário criar uma conta.</p>
              <p>Você pode ver todos os anúncios e contatar vendedores sem precisar se cadastrar.</p>
              
              <div className="mt-3 flex items-start gap-2">
                <Home className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p><strong>Vantagem para cadastrados:</strong> Filtre anúncios para ver apenas os do seu condomínio e encontre ofertas próximas de você!</p>
              </div>
            
              <div className="flex flex-wrap gap-3 mt-4">
                <Button asChild variant="outline" size="sm" className="bg-white">
                  <Link to="/explorar" className="flex items-center gap-1">
                    Explorar anúncios <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/cadastro" className="flex items-center gap-1">
                    <User size={16} />
                    Quero anunciar
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroHeading;
