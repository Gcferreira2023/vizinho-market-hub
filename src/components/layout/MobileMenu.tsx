
import { Link } from "react-router-dom";

interface MobileMenuProps {
  isLoggedIn: boolean;
  onSignOut: () => Promise<void>;
  onClose: () => void;
}

const MobileMenu = ({ isLoggedIn, onSignOut, onClose }: MobileMenuProps) => {
  const handleSignOut = async () => {
    await onSignOut();
    onClose();
  };

  return (
    <nav className="md:hidden bg-white border-t">
      <div className="flex flex-col">
        {isLoggedIn ? (
          <>
            <Link
              to="/perfil"
              className="px-4 py-3 border-b text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Meu Perfil
            </Link>
            <Link
              to="/meus-anuncios"
              className="px-4 py-3 border-b text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Meus Anúncios
            </Link>
            <Link
              to="/criar-anuncio"
              className="px-4 py-3 border-b text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Anunciar
            </Link>
            <Link
              to="/favoritos"
              className="px-4 py-3 border-b text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Favoritos
            </Link>
            <button 
              className="px-4 py-3 text-left text-gray-700 hover:bg-gray-50"
              onClick={handleSignOut}
            >
              Sair
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-3 border-b text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Entrar
            </Link>
            <Link
              to="/cadastro"
              className="px-4 py-3 text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Cadastrar
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default MobileMenu;
