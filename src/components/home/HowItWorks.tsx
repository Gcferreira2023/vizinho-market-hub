
import { ShoppingCart, User, Star, MessageCircle } from "lucide-react";

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Step = ({ icon, title, description }: StepProps) => {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="bg-primary/10 rounded-full p-4 mb-4 text-primary">
        {icon}
      </div>
      <h3 className="font-semibold text-xl mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      icon: <User size={32} />,
      title: "Crie sua conta",
      description: "Cadastre-se com seu email e dados do apartamento",
    },
    {
      icon: <ShoppingCart size={32} />,
      title: "Crie anúncios",
      description: "Adicione fotos e detalhes dos seus produtos ou serviços",
    },
    {
      icon: <MessageCircle size={32} />,
      title: "Conecte-se",
      description: "Converse com os vizinhos interessados via WhatsApp",
    },
    {
      icon: <Star size={32} />,
      title: "Avalie e seja avaliado",
      description: "Construa uma reputação positiva no condomínio",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Como funciona</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            O VizinhoMarket facilita a compra e venda de produtos e serviços entre vizinhos do mesmo condomínio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Step key={index} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
