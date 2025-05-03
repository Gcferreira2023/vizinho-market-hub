
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  className?: string;
}

const SearchBar = ({ className = "" }: SearchBarProps) => {
  return (
    <div className={`relative w-full ${className}`}>
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
  );
};

export default SearchBar;
