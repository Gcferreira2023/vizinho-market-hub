
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface SearchBarProps {
  className?: string;
  onSearch?: () => void;
}

const SearchBar = ({ className = "", onSearch }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle basic search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log(`Executando busca por: ${searchTerm.trim()}`);
      navigate(`/explorar?search=${encodeURIComponent(searchTerm.trim().toLowerCase())}`);
      
      toast({
        title: "Buscando",
        description: `Procurando por "${searchTerm.trim()}"`,
      });
      
      setSearchTerm("");
      if (onSearch) onSearch(); // Call the onSearch callback if provided
    }
  };

  // Open advanced search dialog
  const handleAdvancedSearch = () => {
    setOpen(true);
  };

  // Handle keyboard shortcut to open command dialog
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "/" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setOpen(true);
    }
  };

  const categoryOptions = [
    { value: "alimentos", label: "Alimentos" },
    { value: "servicos", label: "Serviços" },
    { value: "produtos", label: "Produtos Gerais" },
    { value: "vagas", label: "Vagas/Empregos" }
  ];

  return (
    <>
      <div className={`relative w-full ${className}`} onKeyDown={handleKeyDown}>
        <form onSubmit={handleSearch}>
          <Input
            type="search"
            placeholder="Buscar produtos e serviços..."
            className="pr-24"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="text-xs text-gray-500 hover:text-gray-700" 
              onClick={handleAdvancedSearch}
            >
              Avançada
            </Button>
            <Search className="text-gray-400 cursor-pointer" size={18} onClick={handleSearch} />
          </div>
        </form>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Busca avançada..." 
          value={searchTerm}
          onValueChange={setSearchTerm}
        />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Categorias">
            {categoryOptions.map((category) => (
              <CommandItem
                key={category.value}
                onSelect={() => {
                  navigate(`/categoria/${category.value}`);
                  setOpen(false);
                }}
              >
                {category.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Ações">
            <CommandItem
              onSelect={() => {
                if (searchTerm.trim()) {
                  navigate(`/explorar?search=${encodeURIComponent(searchTerm.trim().toLowerCase())}`);
                  setOpen(false);
                  setSearchTerm("");
                  if (onSearch) onSearch(); // Call the onSearch callback if provided
                }
              }}
            >
              Buscar "{searchTerm}"
            </CommandItem>
            <CommandItem
              onSelect={() => {
                navigate("/explorar");
                setOpen(false);
              }}
            >
              Ver todos os anúncios
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchBar;
