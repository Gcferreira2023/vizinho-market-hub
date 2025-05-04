
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: Usuário tentou acessar uma rota inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="inline-flex h-20 w-20 rounded-full bg-red-50 p-4 mb-6">
            <AlertCircle size={48} className="text-red-500" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Página não encontrada</h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Desculpe, mas a página que você está procurando não existe ou foi movida.
          </p>
          
          <div className="space-y-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/">Voltar à página inicial</Link>
            </Button>
            
            <div className="text-gray-500">
              <p>Ou tente acessar uma dessas páginas:</p>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <Link to="/explorar" className="text-primary hover:underline">
                  Explorar Anúncios
                </Link>
                <Link to="/como-funciona" className="text-primary hover:underline">
                  Como Funciona
                </Link>
                <Link to="/contato" className="text-primary hover:underline">
                  Contato
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
