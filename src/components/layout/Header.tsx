
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X, User, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = false; // Temporariamente falso até implementarmos autenticação

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary p-1 rounded">
              <ShoppingCart size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold text-primary hidden md:block">
              VizinhoMarket
            </span>
          </Link>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex items-center flex-1 mx-6">
          <div className="relative w-full max-w-md">
            <Input
              type="search"
              placeholder="Buscar produtos e serviços..."
              className="pr-10"
            />
            <Search 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              size={18} 
            />
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
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
                  <DropdownMenuItem>Sair</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Entrar</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/cadastro">Cadastrar</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative w-full">
          <Input
            type="search"
            placeholder="Buscar produtos e serviços..."
            className="pr-10"
          />
          <Search 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={18} 
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t">
          <div className="flex flex-col">
            {isLoggedIn ? (
              <>
                <Link
                  to="/perfil"
                  className="px-4 py-3 border-b text-gray-700 hover:bg-gray-50"
                >
                  Meu Perfil
                </Link>
                <Link
                  to="/meus-anuncios"
                  className="px-4 py-3 border-b text-gray-700 hover:bg-gray-50"
                >
                  Meus Anúncios
                </Link>
                <Link
                  to="/criar-anuncio"
                  className="px-4 py-3 border-b text-gray-700 hover:bg-gray-50"
                >
                  Anunciar
                </Link>
                <Link
                  to="/favoritos"
                  className="px-4 py-3 border-b text-gray-700 hover:bg-gray-50"
                >
                  Favoritos
                </Link>
                <div className="px-4 py-3 text-gray-700 hover:bg-gray-50">
                  Sair
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-3 border-b text-gray-700 hover:bg-gray-50"
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  className="px-4 py-3 text-gray-700 hover:bg-gray-50"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
