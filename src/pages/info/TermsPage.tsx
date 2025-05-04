
import React from "react";
import Layout from "@/components/layout/Layout";

const TermsPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Termos de Uso</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="mb-4">
            Bem-vindo ao VizinhoMarket. Ao acessar ou usar nosso serviço, você concorda 
            com estes termos. Por favor, leia-os atentamente.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">1. Aceitação dos Termos</h2>
          <p>
            Ao acessar ou usar o VizinhoMarket, você concorda em ficar vinculado a estes 
            Termos de Serviço e a todas as leis e regulamentos aplicáveis. Se você não 
            concordar com algum destes termos, está proibido de usar este serviço.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">2. Uso do Serviço</h2>
          <p>
            O VizinhoMarket é uma plataforma que permite que moradores de condomínios 
            vendam produtos e serviços entre si. Você concorda em usar o serviço apenas 
            para fins legais e de acordo com estes termos.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">3. Contas de Usuário</h2>
          <p>
            Para usar certos recursos do nosso serviço, você pode precisar criar uma conta.
            Você é responsável por manter a confidencialidade de sua conta e senha e por 
            restringir o acesso ao seu computador ou dispositivo. Você concorda em aceitar 
            responsabilidade por todas as atividades que ocorram em sua conta.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">4. Conteúdo do Usuário</h2>
          <p>
            Nosso serviço permite que você poste, publique e compartilhe conteúdo. Ao 
            fornecer conteúdo ao serviço, você declara e garante que:
          </p>
          <ul className="list-disc pl-5 mt-2 mb-4">
            <li>O conteúdo é seu ou você tem o direito de usá-lo e conceder-nos os direitos e licença conforme previsto nestes termos.</li>
            <li>O conteúdo não viola os direitos de privacidade, publicidade, direitos autorais, direitos contratuais ou quaisquer outros direitos de qualquer pessoa.</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">5. Responsabilidade pelos Anúncios</h2>
          <p>
            O VizinhoMarket não se responsabiliza pela qualidade, segurança, legalidade
            ou qualquer outro aspecto dos produtos ou serviços anunciados na plataforma.
            Todas as transações são de responsabilidade exclusiva dos usuários envolvidos.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">6. Alterações</h2>
          <p>
            Reservamo-nos o direito, a nosso critério, de modificar ou substituir estes termos
            a qualquer momento. Se houver uma revisão, tentaremos fornecer aviso com pelo 
            menos 30 dias de antecedência da entrada em vigor de quaisquer novos termos.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">7. Contato</h2>
          <p>
            Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco
            através da nossa página de contato.
          </p>
          
          <p className="mt-8 text-sm text-gray-500">
            Última atualização: 04 de maio de 2025
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default TermsPage;
