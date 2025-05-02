
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HowItWorksPage = () => {
  const steps = [
    {
      title: "Cadastre-se",
      description: "Crie sua conta informando seus dados pessoais e do apartamento. É rápido e gratuito!",
      icon: "👤"
    },
    {
      title: "Crie Anúncios",
      description: "Adicione fotos, descrição e preço dos produtos ou serviços que deseja vender ou oferecer.",
      icon: "📝"
    },
    {
      title: "Venda ou Compre",
      description: "Entre em contato com vendedores ou receba contatos de compradores interessados nos seus anúncios.",
      icon: "💼"
    },
    {
      title: "Avalie",
      description: "Após a transação, deixe sua avaliação sobre o vendedor para ajudar outros moradores.",
      icon: "⭐"
    },
  ];

  const benefits = [
    "Economia: compre produtos e serviços de vizinhos sem intermediários",
    "Comodidade: receba entregas no seu apartamento",
    "Comunidade: fortalecimento das relações entre moradores",
    "Segurança: contato apenas com pessoas que moram no seu condomínio",
    "Sustentabilidade: estímulo à economia local e redução de deslocamentos"
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Como Funciona o VizinhoMarket</h1>
          <p className="text-lg text-gray-700 mb-12 text-center">
            O marketplace que conecta moradores do seu condomínio para compra e venda de produtos e serviços.
          </p>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-semibold mb-8 text-center">Em 4 Passos Simples</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {steps.map((step, index) => (
                  <div 
                    key={index}
                    className="bg-white p-6 rounded-lg border shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="text-3xl">{step.icon}</div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">{index + 1}. {step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">Benefícios</h2>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="text-primary">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-primary/10 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 text-center">Pronto para começar?</h2>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                <Button size="lg" asChild>
                  <Link to="/cadastro">Criar Conta Agora</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/explorar">Explorar Anúncios</Link>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HowItWorksPage;
