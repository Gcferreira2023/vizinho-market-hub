
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useMobile } from "@/hooks/useMobile";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import Logo from "./Logo";
import SearchBar from "./SearchBar";
import AuthenticatedMenu from "./AuthenticatedMenu";
import UnauthenticatedMenu from "./UnauthenticatedMenu";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useMobile();
  
  const isLoggedIn = !!user;
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você saiu da sua conta"
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível fazer logout",
        variant: "destructive"
      });
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex items-center flex-1 mx-6">
          <SearchBar className="max-w-md" />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <AuthenticatedMenu onSignOut={handleSignOut} />
          ) : (
            <UnauthenticatedMenu />
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Search size={22} />
              </Button>
            </DialogTrigger>
            <DialogContent className="p-4 max-w-[90vw] top-4 translate-y-0">
              <SearchBar 
                className="w-full" 
                onSearch={() => setIsSearchOpen(false)} 
              />
            </DialogContent>
          </Dialog>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <MobileMenu 
          isLoggedIn={isLoggedIn} 
          onSignOut={handleSignOut}
          onClose={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
