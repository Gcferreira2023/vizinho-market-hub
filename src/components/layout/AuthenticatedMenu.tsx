
import { Link } from "react-router-dom";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AuthenticatedMenuProps {
  onSignOut: () => Promise<void>;
}

const AuthenticatedMenu = ({ onSignOut }: AuthenticatedMenuProps) => {
  return (
    <>
      <Button variant="ghost" size="sm" asChild>
        <Link to="/criar-anuncio" className="flex items-center gap-2">
          Anunciar
        </Link>
      </Button>
      <Button variant="ghost" size="sm" asChild>
        <Link to="/favoritos" className="flex items-center gap-2">
          Favoritos
        </Link>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Bell size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem>Nenhuma notificação</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <User size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to="/perfil">Meu Perfil</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/meus-anuncios">Meus Anúncios</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onSignOut}>
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default AuthenticatedMenu;
