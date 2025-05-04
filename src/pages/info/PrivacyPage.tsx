
import React from "react";
import Layout from "@/components/layout/Layout";

const PrivacyPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="mb-4">
            Sua privacidade é importante para nós. Esta Política de Privacidade explica quais 
            informações pessoais coletamos e como as utilizamos.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">1. Informações que Coletamos</h2>
          <p>
            Coletamos informações que você nos fornece diretamente, como quando você:
          </p>
          <ul className="list-disc pl-5 mt-2 mb-4">
            <li>Cria uma conta</li>
            <li>Publica um anúncio</li>
            <li>Envia uma mensagem para outro usuário</li>
            <li>Preenche formulários em nosso serviço</li>
          </ul>
          <p>
            Essas informações podem incluir seu nome, endereço de e-mail, número de telefone,
            bloco e apartamento do condomínio e outras informações que você escolher fornecer.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">2. Como Usamos Suas Informações</h2>
          <p>Usamos as informações que coletamos para:</p>
          <ul className="list-disc pl-5 mt-2 mb-4">
            <li>Fornecer, manter e melhorar nossos serviços</li>
            <li>Processar suas transações</li>
            <li>Enviar comunicações relacionadas ao serviço</li>
            <li>Responder a seus comentários, perguntas e solicitações</li>
            <li>Monitorar e analisar tendências, uso e atividades</li>
            <li>Personalizar e melhorar a experiência do usuário</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">3. Compartilhamento de Informações</h2>
          <p>
            Não vendemos, comercializamos ou transferimos suas informações pessoais identificáveis 
            para terceiros, exceto nas seguintes circunstâncias:
          </p>
          <ul className="list-disc pl-5 mt-2 mb-4">
            <li>Com outros usuários quando você usa recursos de comunicação da plataforma</li>
            <li>Com prestadores de serviços que nos ajudam a operar nosso serviço</li>
            <li>Se exigido por lei ou para proteger direitos, propriedade ou segurança</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">4. Segurança</h2>
          <p>
            Implementamos medidas de segurança para proteger suas informações pessoais. No entanto, 
            nenhum método de transmissão pela internet ou método de armazenamento eletrônico é 100% 
            seguro, e não podemos garantir sua segurança absoluta.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">5. Cookies</h2>
          <p>
            Usamos cookies e tecnologias similares para rastrear a atividade em nosso serviço e 
            armazenar certas informações. Você pode instruir seu navegador a recusar todos os cookies 
            ou a indicar quando um cookie está sendo enviado.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">6. Alterações a Esta Política de Privacidade</h2>
          <p>
            Podemos atualizar nossa Política de Privacidade de tempos em tempos. Notificaremos você 
            sobre quaisquer alterações publicando a nova Política de Privacidade nesta página.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">7. Contato</h2>
          <p>
            Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco 
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

export default PrivacyPage;
