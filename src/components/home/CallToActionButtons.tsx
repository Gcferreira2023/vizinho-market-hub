
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const CallToActionButtons = () => {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <Button size="lg" variant="secondary" className="text-lg py-6" asChild>
        <Link to={isLoggedIn ? "/criar-anuncio" : "/cadastro"}>
          {isLoggedIn ? "Anunciar Agora" : "Cadastrar e Anunciar"}
        </Link>
      </Button>
      <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
        <Link to="/como-funciona">Como funciona</Link>
      </Button>
    </div>
  );
};

export default CallToActionButtons;
