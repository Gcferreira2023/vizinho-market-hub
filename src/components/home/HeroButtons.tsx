
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const HeroButtons = () => {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {isLoggedIn ? (
        <Button size="lg" asChild>
          <Link to="/criar-anuncio">Quero anunciar</Link>
        </Button>
      ) : (
        <Button size="lg" asChild>
          <Link to="/cadastro">Cadastre-se</Link>
        </Button>
      )}
    </div>
  );
};

export default HeroButtons;
