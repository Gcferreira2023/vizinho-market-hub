
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const UnauthenticatedMenu = () => {
  return (
    <>
      <Button variant="outline" size="sm" asChild>
        <Link to="/login">Entrar</Link>
      </Button>
      <Button size="sm" asChild>
        <Link to="/cadastro">Cadastrar</Link>
      </Button>
    </>
  );
};

export default UnauthenticatedMenu;
