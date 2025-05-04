
import { useAuth } from "@/contexts/AuthContext";

const HeroHeading = () => {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
    <>
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Compre e venda no seu condomínio
      </h1>
      <p className="text-lg text-gray-600 mb-2">
        O VizinhoMarket conecta moradores do seu condomínio para comprar e vender produtos e serviços de forma prática e segura.
      </p>
      
      {!isLoggedIn && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md text-sm mb-6">
          <p><strong>Navegue à vontade!</strong> Você não precisa criar uma conta para ver anúncios e contatar vendedores.</p>
          <p className="mt-1">Apenas quem deseja anunciar produtos ou serviços precisa se cadastrar.</p>
        </div>
      )}
    </>
  );
};

export default HeroHeading;
